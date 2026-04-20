import React, { useMemo } from "react";
import { Table, ScrollArea, Paper, Alert } from "@mantine/core";
import type { ExecuteQueryResponse } from "@api/configs/types";


type Props = {
    data: ExecuteQueryResponse;
};

export const ResultTable: React.FC<Props> = ({
    data,
}) => {
    const columns = useMemo(() => {
        if (!data.length) return [];
        return Object.keys(data[0]);
    }, [data]);

    return (
        <>
            {data.length
                ? <Paper withBorder flex={1} radius="md" h={'fit-content'} p={2}>
                    <ScrollArea>
                        <Table striped highlightOnHover withColumnBorders stickyHeader>
                            <Table.Thead>
                                <Table.Tr>
                                    {columns.map((col) => (
                                        <Table.Th fw={700} key={col}>
                                            {col}
                                        </Table.Th>
                                    ))}
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {data.map((row, i) => (
                                    <Table.Tr key={i}>
                                        {columns.map((col) => (
                                            <Table.Td key={col}>
                                                {String(row[col])}
                                            </Table.Td>
                                        ))}
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
                : null
            }
            {!data.length
                ? <Alert variant="light" color="var(--accent)" title="По указанному запросу нет данных" />
                : null
            }
        </>
    );
};