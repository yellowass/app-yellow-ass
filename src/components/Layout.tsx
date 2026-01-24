import React, { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
    Container,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'

const Layout = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Управление кнопкой "Назад" в Telegram
        // if (window.Telegram && window.Telegram.WebApp) {
        //     const webApp = window.Telegram.WebApp;
        //
        //     if (location.pathname === '/') {
        //         webApp.BackButton.hide();
        //     } else {
        //         webApp.BackButton.show();
        //     }
        // }
    }, [location]);

    const handleBack = () => {
        navigate(-1);
    };

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
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 2 }}>
                {children}
            </Container>
        </Box>
    )
}

export default Layout