import { ethers, Contract } from 'ethers';
import CommonWillFactory from '../contracts/CommonWillFactory.json';
import CommonWill from '../contracts/CommonWill.json';
import PledgeToken from '../contracts/PledgeToken.json';

const getProvider = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if(window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const commonWillFactory = new Contract(
            CommonWillFactory.networks[window.ethereum.networkVersion].address,
            CommonWillFactory.abi,
          signer
        );

        const pledgeToken = new Contract(
            PledgeToken.networks[window.ethereum.networkVersion].address,
            PledgeToken.abi,
          signer
        );

        const proxy = new Contract(
            '0xA6Bda1b9Bb44685CD1640758c038e17D52Ceeb33',
            CommonWill.abi,
          signer
        );

        resolve({signer, commonWillFactory, pledgeToken, proxy});
      }
      resolve({signer: undefined, commonWillFactory: undefined, pledgeToken: undefined, proxy: undefined});
    });
  });

export default getProvider;
