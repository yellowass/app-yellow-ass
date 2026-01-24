import React, {useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import moment from "moment/moment";
import {
    Typography,
    Box,
    Button,
    Rating,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    Grid,
    Card,
    CardMedia, Tooltip, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ShieldIcon from '@mui/icons-material/Shield';
import {AppTreeContext} from "../App";
import {IAppTree, IAppTreeConfig, IAppTreeFile, IAppTreeVersion} from "../types/tree";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Files = () => {
    const [copiedId, setCopiedId] = useState<number>(0)

    const { versionId } = useParams()
    const navigate = useNavigate()

    const appTree: IAppTree = useContext(AppTreeContext)

    const files: IAppTreeFile[] = []
    let currentVersion: IAppTreeVersion = {} as IAppTreeVersion
    for (const group of Object.values(appTree)) {
        const configs: IAppTreeConfig = group.configs
        for (const config of Object.values(configs)) {
            const versions: IAppTreeVersion[] = config.versions
            for (const version of versions) {
                if (version.versionId === Number(versionId)) {
                    files.push(...version.files)
                    currentVersion = {...version}
                    break
                }
                if (files.length) break
            }
            if (files.length) break
        }
        if (files.length) break
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

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Информация о товаре */}
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                            {currentVersion.versionName}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {moment(currentVersion.versionDate).format('DD.MM.YYYY')}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Описание */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Минимальная версия платформы:
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {currentVersion.minVersions.join(',')}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Обновление версии:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                            {currentVersion.previousVersions.join(',')}
                        </Typography>
                    </Box>

                    {/* Характеристики */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Ссылки на файл
                        </Typography>
                        <Grid container spacing={1}>
                            {currentVersion.files.map((file, index) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography variant="body2">{file.fileLabel}</Typography>
                                        <Tooltip title={file.fileId === copiedId ? "Скопировано!" : "Копировать ссылку"}>
                                            <IconButton
                                                onClick={() => handleCopyCode(file.fileId, file.fileLink as string)}
                                                color={copiedId === file.fileId ? "success" : "default"}
                                                size="small"
                                            >
                                                {copiedId === file.fileId ? <CheckIcon /> : <ContentCopyIcon />}
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Files