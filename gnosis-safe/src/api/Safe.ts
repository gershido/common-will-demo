import Safe, { SafeFactory, SafeAccountConfig, EthersAdapter } from '@gnosis.pm/safe-core-sdk'

export async function deployNewSafe(ethersAdapter : EthersAdapter, owners: string[], threshold: number) : Promise<Safe>{
    const safeFactory = await SafeFactory.create({ ethAdapter: ethersAdapter});
    const safeAccountConfig: SafeAccountConfig = { owners, threshold };
    const safeSdk: Safe = await safeFactory.deploySafe(safeAccountConfig);

    return safeSdk;
}

export async function connectExistingSafe(ethersAdapter : EthersAdapter, safeAddress: string){
    const safeSdk: Safe = await Safe.create({ ethAdapter: ethersAdapter, safeAddress });
    
    return safeSdk;
}

export async function getSafeDetails(safeSdk: Safe){
    const owners = await safeSdk.getOwners();
    const threshold = await safeSdk.getThreshold();
    const address = await safeSdk.getAddress();
    const balance = await safeSdk.getBalance();

    return {address, owners, threshold, balance};
}