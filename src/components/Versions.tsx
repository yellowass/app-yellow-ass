import React, { FC, useContext } from 'react'
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableHead, TableRow,
    Typography,
    Chip
} from '@mui/material'
import {useNavigate, useParams} from 'react-router-dom'
import moment from 'moment'

import { AppTreeContext } from '../App'
import { IAppTreeVersion } from '../types/tree'

const Versions: FC = () => {
    const { configId } = useParams()
    const navigate = useNavigate()

    const appTree = useContext(AppTreeContext)

    const config = Object.values(appTree).filter(g => g.configs[Number(configId)])[0].configs[Number(configId)]
    const versions: IAppTreeVersion[] = config.versions

    const isFresh = (src: string): 'red' | 'black' => {
        return moment().diff(moment(src), 'days') <= 7 ? 'red' : 'black'
    }

    const handleClick = (versionId: number) => {
        const files = config.versions.filter((v: IAppTreeVersion)  => v.versionId === versionId)[0].files
        if (files && files.length) navigate(`/files/${versionId}`)
    }

    const getStatusColor = (status: string): { label: string, color: 'error' | 'warning' | 'success' } => {
        if (status === 'not available') return { label: 'нет', color: 'error' }
        if (status === 'request') return { label: 'по запросу', color: 'warning' }
        return { label: 'есть', color: 'success' }
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Список версий
            </Typography>

            <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Наименование</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Дата</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Файл</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {versions.map((row) => (
                            <TableRow
                                key={row.versionId}
                                hover
                                sx={{
                                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                                    '&:last-child td, &:last-child th': { border: 0 }
                                }}
                                onClick={() => handleClick(row.versionId)}
                            >
                                <TableCell>{row.versionName}</TableCell>
                                <TableCell sx={{ color: isFresh(row.versionDate) }}>{row.versionDate ? moment(row.versionDate).format('DD.MM.YYYY') : '-'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusColor(row.versionStatus).label}
                                        color={getStatusColor(row.versionStatus).color}
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default Versions