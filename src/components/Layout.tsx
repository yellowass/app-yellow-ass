import React, {ReactNode, useCallback, useContext, useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import {
    Container,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem, SelectChangeEvent
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import {AppTreeContext} from "../App";
import {ISubscriptions, TFilter} from "../types/tree";

const Layout = ({ children }: { children: ReactNode }) => {
    const { tg, queryId, user, chat} = useTelegram()

    const app = useContext(AppTreeContext)
    const { appTree, appSettings, updateFilter } = app;

    const [subscriptions, setSubscriptions] = useState<ISubscriptions[]>([])
    const [requestVersions, setRequestVersions] = useState<number[]>([])

    const navigate = useNavigate()
    const location = useLocation()

    const handleBack = () => {
        navigate(-1);
    };

    const handleChange = (event: SelectChangeEvent<string>) => {
        updateFilter(event.target.value as TFilter)
    }

    const onSendData = useCallback(async () => {
        tg.sendData(JSON.stringify({
            type: 'setData',
            data: {
                subscriptions,
                requestVersions
            },
        }));
    }, [subscriptions, requestVersions])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Отправить данные'
        })
    }, [])

    useEffect(() => {
        console.log('appTree.filter - ', appSettings.filter)
    }, [appSettings.filter])

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar
                position="sticky"
                sx={{
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}
            >
                <Toolbar>
                    {location.pathname !== '/' && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleBack}
                            sx={{ mr: 2 }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Назад
                    </Typography>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Фильтр</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={appSettings.filter}
                                label="Фильтр"
                                onChange={handleChange}
                            >
                                <MenuItem value={'all'}>Все</MenuItem>
                                <MenuItem value={'file'}>Есть файл</MenuItem>
                                <MenuItem value={'request'}>Запросить</MenuItem>
                                <MenuItem value={'sub'}>Подписки</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 2 }}>
                {children}
            </Container>
        </Box>
    )
}

export default Layout