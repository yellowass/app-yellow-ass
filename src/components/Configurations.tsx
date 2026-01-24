import React, { FC, useContext, useEffect, useState } from 'react'
import {
    Box,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment/moment'

import { IAppTreeVersion } from '../types/tree'
import { AppTreeContext } from '../App'

interface IConfigs {
    configId: number
    configName: string
    configLink: string | null
    versions: IAppTreeVersion[]
    isSub: boolean
}

const Configurations: FC = () => {
    const [copiedId, setCopiedId] = useState<number>(0)
    const [configs, setConfigs] = useState<IConfigs[]>([])

    const { groupId } = useParams()
    const navigate = useNavigate()

    const app = useContext(AppTreeContext)
    const { appSettings, appTree, updateSubscriptions } = app

    const handleClick = (configId: number) => {
        navigate(`/versions/${configId}`)
    }

    const handleCopyCode = async (id: number, link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            setCopiedId(id);

            // Сбрасываем через 2 секунды
            setTimeout(() => {
                setCopiedId(0);
            }, 2000);
        } catch (err) {
            console.error('Ошибка копирования:', err);

            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = link;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            setCopiedId(id);
            setTimeout(() => setCopiedId(0), 2000);
        }
    }

    const isFresh = (src: string): 'red' | 'black' => {
        return moment().diff(moment(src), 'days') <= 7 ? 'red' : 'black'
    }

    useEffect(() => {
        const configsFilter: IConfigs[] = []

        const group = appTree[Number(groupId)]
        const { configs } = group
        const { subscriptions } = appSettings
        const subscriptionsSet = new Set(subscriptions);

        for (const configId in configs) {
            const cId = Number(configId);
            const item = configs[cId];

            const isSub = subscriptionsSet.has(configId);

            let isFilter = false;

            switch (appSettings.filter) {
                case 'all':
                    isFilter = true;
                    break;
                case 'sub':
                    isFilter = isSub;
                    break;
                case 'request':
                    isFilter = item.configStatus === 'request';
                    break;
                case 'file':
                    isFilter = item.configStatus === 'file';
                    break;
                default:
                    // Для 'all' или других значений
                    isFilter = appSettings.filter === 'all' ||
                        (appSettings.filter === 'no' && item.configStatus === 'no');
                    break;
            }

            if (isFilter) {
                configsFilter.push({
                    configId: cId,
                    configName: item.configName,
                    configLink: item.configLink,
                    versions: item.versions,
                    isSub
                });
            }
        }
        setConfigs(configsFilter)
    }, [appSettings.filter, appSettings.subscriptions])

    function handleDelSub(configId: number) {
        const currentSub = appSettings.subscriptions.filter(s => s !== String(configId))
        updateSubscriptions(currentSub)
    }

    function handleAddSub(configId: number) {
        if (appSettings.subscriptions.length >= 10) {
            alert('Количество подписок не может превышать 10')
        } else {
            updateSubscriptions([...appSettings.subscriptions, String(configId)])
        }
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Список конфигураций
            </Typography>

            <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Наименование</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Версия</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Дата</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ссылка</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Подписка</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {configs.map((row) => (
                            <TableRow
                                key={row.configId}
                                hover
                                sx={{
                                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                                    '&:last-child td, &:last-child th': { border: 0 }
                                }}
                            >
                                <TableCell
                                    onClick={() => handleClick(row.configId)}
                                >
                                    {row.configName}
                                </TableCell>
                                <TableCell>{row.versions.length ? row.versions[0].versionName : '-'}</TableCell>
                                <TableCell sx={{ color: isFresh(row.versions[0].versionDate) }}>{row.versions.length ? moment(row.versions[0].versionDate).format('DD.MM.YYYY') : '-'}</TableCell>
                                <TableCell>
                                    {row.configLink
                                        ?
                                        <Tooltip title={row.configId === copiedId ? "Скопировано!" : "Копировать ссылку"}>
                                            <IconButton
                                                onClick={() => handleCopyCode(row.configId, row.configLink as string)}
                                                color={copiedId === row.configId ? "success" : "default"}
                                                size="small"
                                            >
                                                {copiedId === row.configId ? <CheckIcon /> : <ContentCopyIcon />}
                                            </IconButton>
                                        </Tooltip>
                                        :
                                            '-'
                                    }
                                </TableCell>
                                <TableCell>
                                    {row.isSub
                                        ?
                                            <IconButton
                                                onClick={() => handleDelSub(row.configId)}
                                                color={"success"}
                                                size="small"
                                            >
                                                <CheckIcon />
                                            </IconButton>
                                        :
                                            <IconButton
                                                onClick={() => handleAddSub(row.configId)}
                                                color={"default"}
                                                size="small"
                                            >
                                                <AddIcon />
                                            </IconButton>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default Configurations
