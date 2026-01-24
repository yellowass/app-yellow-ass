import React, { useContext } from 'react'
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { AppTreeContext } from '../App'
import { useNavigate } from 'react-router-dom'

function Groups() {
    const navigate = useNavigate()

    const appTree = useContext(AppTreeContext)

    const groups = Object.keys(appTree).map(groupId => ({ id: groupId, name: appTree[Number(groupId)].groupName }))

    const handleClick = (groupId: string) => {
        navigate(`/configs/${groupId}`)
    }

    return (
        <>
            {groups.map((g: { id: string, name: string }) => (
                <Card
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
                                    label={`${Object.keys(appTree[Number(g.id)].configs).length} элементов`}
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