import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Button, CopyButton, Tooltip, Paper } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import s from './styles.module.scss';

type Props = {
    code: string;
    language?: string;
};

export const SqlHighlight: React.FC<Props> = ({ code, language = 'sql' }) => {
    const customStyle = {
        margin: 0,
        padding: '16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'var(--font)',
        lineHeight: 1.5,
        background: '#f8f9fa',
        color: '#433e3f'
    };

    return (
        <Paper withBorder radius="md" className={s.wrapper}>
            <div className={s.header}>
                <span className={s.language}>SQL</span>
                <CopyButton value={code} timeout={2000}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Скопировано!' : 'Копировать'} withArrow>
                            <Button
                                variant="subtle"
                                size="compact-sm"
                                onClick={copy}
                                className={s.copyButton}
                            >
                                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                            </Button>
                        </Tooltip>
                    )}
                </CopyButton>
            </div>
            <SyntaxHighlighter
                language={language}
                style={{}}
                customStyle={customStyle}
                showLineNumbers={false}
                wrapLines={true}
                wrapLongLines={true}
                PreTag="div"
                CodeTag="code"
            >
                {code}
            </SyntaxHighlighter>
        </Paper>
    );
};