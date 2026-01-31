import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { AppTreeContext } from '../App'

function Groups() {
    const navigate = useNavigate()

    const [search, setSearch] = useSearchParams()

    const userSubscriptions = search.get('sub')
    const userRequests = search.get('req')

    const app = useContext(AppTreeContext)
    const { appSettings, updateSubscriptions, updateRequests } = app
    const [groups, setGroups] = useState<{ id: string, name: string, status: "no" | "request" | "file" }[]>([])

    const handleClick = (groupId: string) => {
        navigate(`/configs/${groupId}`)
    }

    useEffect(() => {
        const groupsFilter = Object.keys(app.appTree)
            .map(groupId => ({
                id: groupId,
                name: app.appTree[Number(groupId)].groupName,
                status: app.appTree[Number(groupId)].groupStatus,
                sub: Object.keys(app.appTree[Number(groupId)].configs).some(configId => appSettings.subscriptions.includes(configId))
            }))
            .filter(group => {
                if (appSettings.filter === 'all') return true
                if (appSettings.filter === 'file' && group.status !== 'file') return false
                if (appSettings.filter === 'request' && group.status !== 'request') return false
                if (appSettings.filter === 'sub' && !group.sub) return false
                return true
            })
        setGroups(groupsFilter)
    }, [app])

    useEffect(() => {
        updateSubscriptions(userSubscriptions ? userSubscriptions.split(',') : [])
        if (userRequests) {
            const temp = userRequests.split(',').map((i: string) => {
                return {
                    id: Number(i),
                    oldValue: true,
                    newValue: false
                }
            })
            updateRequests(temp)
        }
    }, [])

    return (
        <>
            {groups.map((g: { id: string, name: string }) => (
                <Card
                    key={g.id}
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                        }
                    }}
                    onClick={() => handleClick(g.id)}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                {g.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Chip
                                    label={`${Object.keys(app.appTree[Number(g.id)].configs).length} элементов`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                                <ChevronRightIcon color="action" />
                            </Box>
                        </CardContent>
                    </Box>
                </Card>
            ))}
        </>
    )
}

export default Groups