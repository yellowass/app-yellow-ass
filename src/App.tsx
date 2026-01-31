import React, { createContext, ReactNode, useContext, useState } from 'react'
import {
    Routes,
    Route,
    HashRouter
} from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { IAppTree, TFilter } from './types/tree'
import Configurations from './components/Configurations'
import Groups from './components/Groups'
import Layout from './components/Layout'
import Versions from './components/Versions'
import Files from './components/Files'

const theme = createTheme({
    palette: {
        primary: {
            main: '#3390ec',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

interface IRequest {
    id: number
    oldValue: boolean
    newValue: boolean
}

interface IApp {
    appTree: IAppTree
    appSettings: IAppSettings
    updateFilter: (newValue: TFilter) => void
    updateSubscriptions: (newValue: string[]) => void
    updateRequests: (newValue: IRequest[]) => void
}

export const AppTreeContext = createContext({} as IApp)

interface AppTreeProviderProps {
    children: ReactNode;
}

interface IAppSettings {
    filter: TFilter
    subscriptions: string[]
    requests: IRequest[]
}

export const AppTreeProvider: React.FC<AppTreeProviderProps> = ({ children }) => {

    const appTree: IAppTree = require('./appTree.json')

    const [appSettings, setAppSettings] = useState<IAppSettings>({
        filter: 'file',
        subscriptions: [],
        requests: []
    })

    const updateFilter = (newValue: TFilter) => {
        setAppSettings(prev => ({
            ...prev,
            filter: newValue
        }))
    }

    const updateSubscriptions = (newValue: string[]) => {
        setAppSettings(prev => ({
            ...prev,
            subscriptions: newValue
        }))
    }

    const updateRequests = (newValue: IRequest[]) => {
        setAppSettings(prev => ({
            ...prev,
            requests: newValue
        }))
    }

    return (
        <AppTreeContext.Provider value={{ appTree, appSettings, updateFilter, updateSubscriptions, updateRequests }}>
            {children}
        </AppTreeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(AppTreeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
                <AppTreeProvider>
                    <HashRouter>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Groups />} />
                                <Route path="/configs/:groupId" element={<Configurations />} />
                                <Route path="/versions/:configId" element={<Versions />} />
                                <Route path="/files/:versionId" element={<Files />} />
                            </Routes>
                        </Layout>
                    </HashRouter>
                </AppTreeProvider>
        </ThemeProvider>
    )
}

export default App