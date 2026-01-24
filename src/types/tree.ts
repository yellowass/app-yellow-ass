interface IAppTreeFile {
    fileId: number
    fileName: string
    fileLabel: string
    fileLink: string | null
}

interface IAppTreeVersion {
    versionId: number
    versionName: string
    versionDate: string
    previousVersions: string[]
    minVersions: string[]
    versionStatus: 'request' | 'new' | 'not available' | 'complete'
    files: IAppTreeFile[]
}

interface IAppTreeConfig {
    [key: number]: {
        configName: string
        configLink: string | null
        versions: IAppTreeVersion[]
    }
}

interface ISubscriptions {
    configId: number
    value: boolean
    isChange: boolean
}

interface IAppTree {
    filter: string
    subscriptions: ISubscriptions[]
    requestVersions: number[]
    [key: number]: {
        groupName: string
        configs: IAppTreeConfig
    }
}

export type {
    IAppTreeFile,
    IAppTreeVersion,
    IAppTreeConfig,
    IAppTree,
    ISubscriptions
}