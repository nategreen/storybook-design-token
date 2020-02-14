import * as React from 'react';

import { TokenGroup } from '../interfaces/token-group.interface';
import { Token } from '../interfaces/token.interface';
import { TokenPresenter } from './presenter/TokenPresenter';
import { Card } from './primitives/Card';
import { Collapsible } from './primitives/Collapsible';
import { IconClose } from './primitives/Icons';
import { TokenName } from './primitives/TokenName';

interface Props {
  tokenGroup: TokenGroup;
}

export const TokenOverview = ({ tokenGroup }: Props) => {
  const [tokens, setTokens] = React.useState<Token[]>([]);

  React.useEffect(() => {
    if (tokenGroup) {
      setTokens(tokenGroup.tokens);
    }
  }, [tokenGroup]);

  const changeTokenValue = React.useMemo(
    () => (token: Token, value: string) => {
      setTokens(tokens.map(t => (t.key === token.key ? { ...t, value } : t)));

      const previewIframe: HTMLIFrameElement = document.querySelector(
        '#storybook-preview-iframe'
      );

      previewIframe.contentWindow.document.documentElement.style.setProperty(
        token.key,
        value
      );
    },
    [tokens]
  );

  const resetTokenValue = React.useMemo(
    () => (token: Token) => {
      setTokens(
        tokenGroup.tokens.map(t =>
          t.key === token.key ? t : tokens.find(to => to.key === t.key)
        )
      );

      const previewIframe: HTMLIFrameElement = document.querySelector(
        '#storybook-preview-iframe'
      );

      previewIframe.contentWindow.document.documentElement.style.setProperty(
        token.key,
        tokenGroup.tokens.find(t => t.key === token.key).value
      );
    },
    [tokens]
  );

  return (
    <>
      <Collapsible id={tokenGroup.label} title={tokenGroup.label}>
        {tokens.map(token => (
          <Card
            aliases={token.aliases && token.aliases.join(', ')}
            description={token.description}
            key={token.key}
            preview={
              <TokenPresenter type={tokenGroup.presenter} token={token} />
            }
            title={<TokenName token={token} />}
            value={
              !token.editable ? (
                <>{token.value}</>
              ) : (
                <>
                  <input
                    onChange={event =>
                      changeTokenValue(token, event.target.value)
                    }
                    type="text"
                    value={token.value}
                  />
                  {token.editable &&
                    tokenGroup.tokens.find(t => t.key === token.key).value !==
                      token.value && (
                      <button
                        onClick={() => resetTokenValue(token)}
                        type="button"
                      >
                        {IconClose}
                      </button>
                    )}
                </>
              )
            }
          ></Card>
        ))}
      </Collapsible>
    </>
  );
};
