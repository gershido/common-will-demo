import Safe, { SafeFactory, SafeAccountConfig, EthersAdapter } from '@gnosis.pm/safe-core-sdk'

export async function deployNewSafe(ethersAdapter : EthersAdapter, owners: string[], threshold: number) : Promise<Safe>{
    const safeFactory = await SafeFactory.create({ ethAdapter: ethersAdapter});
    const safeAccountConfig: SafeAccountConfig = { owners, threshold };
    const safeSdk: Safe = await safeFactory.deploySafe(safeAccountConfig);

    return safeSdk;
}

