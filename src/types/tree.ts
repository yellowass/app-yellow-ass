type TStatus = 'no' | 'request' | 'file'

type TStatusVersion = 'request' | 'new' | 'not available' | 'complete'

type TFilter = 'all' | 'file' | 'request' | 'sub'

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
    versionStatus: TStatusVersion
    files: IAppTreeFile[]
}

interface IAppTreeConfig {
    [key: number]: {
        configName: string
        configLink: string | null
        configStatus: TStatus
        versions: IAppTreeVersion[]
    }
}

interface ISubscriptions {
    configId: number
    value: boolean
    isChange: boolean
}

interface IAppTree {
    [key: number]: {
        groupName: string
        groupStatus: TStatus
        configs: IAppTreeConfig
    }
}

export type {
    IAppTreeFile,
    IAppTreeVersion,
    IAppTreeConfig,
    IAppTree,
    ISubscriptions,
    TFilter
}