import React, { createContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { IAppTree } from './types/tree'
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

export const AppTreeContext = createContext({} as IAppTree)

function App() {
    const appTree: IAppTree = require('./appTree.json')

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
                <AppTreeContext.Provider value={appTree}>
                    <Router>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Groups />} />
                                <Route path="/configs/:groupId" element={<Configurations />} />
                                <Route path="/versions/:configId" element={<Versions />} />
                                <Route path="/files/:versionId" element={<Files />} />
                            </Routes>
                        </Layout>
                    </Router>
                </AppTreeContext.Provider>
        </ThemeProvider>
    )
}

export default App