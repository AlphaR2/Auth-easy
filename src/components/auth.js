import { useEffect, useState } from "react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Web3Auth } from "@web3auth/modal";
import { SolanaWallet } from "@web3auth/solana-provider";
import { SolanaWalletConnectorPlugin } from "@web3auth/solana-wallet-connector-plugin";
import { SolflareAdapter } from "@web3auth/solflare-adapter";
import { SlopeAdapter } from "@web3auth/slope-adapter";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { SolanaWalletAdapter } from "@web3auth/torus-solana-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

import Main from "./main";
import Home from "./home";

const clientId =
  "BHIaCF-BCxt3wGdhZA8zp3WwrG06pDLdrm70OdVcVMrzAAH5rP3ktPk0o3h8FQNHoyW2Yfji-iRXskrIvcHXNxU";

const Auth = () => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [userData, setUserData] = useState({});
  const [publik, setPublik] = useState({});
  const [solanaWallet, setSolanaWallet] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: "solana",
          chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          displayName: "Solana Devnet",
          blockExplorer: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana Token",
          rpcTarget: "https://api.devnet.solana.com",
        };

        const web3auth = new Web3Auth({
          clientId,
          chainConfig,
        });
        const privateKeyProvider = new SolanaPrivateKeyProvider({
          config: { chainConfig },
        });

        const torusPlugin = new SolanaWalletConnectorPlugin({
          torusWalletOpts: {
            TorusCtorArgs: {
              buttonPosition: "top-right",
            },
          },
          walletInitOptions: {
            whiteLabel: {
              name: "Whitelabel Demo",
              theme: { isDark: true, colors: { torusBrand1: "#6a040f" } },
              logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
              topupHide: true,
              defaultLanguage: "en",
            },
            enableLogging: true,
          },
        });

        await web3auth.addPlugin(torusPlugin);

        const solflareAdapter = new SolflareAdapter({
          clientId,
        });
        web3auth.configureAdapter(solflareAdapter);

        const slopeAdapter = new SlopeAdapter({
          clientId,
        });
        web3auth.configureAdapter(slopeAdapter);

        setWeb3auth(web3auth);
        // OPEN LOGIN CONFIG
        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "default",
          },
          adapterSettings: {
            mfaSettings: {
              deviceShareFactor: {
                enable: true,
                priority: 1,
                mandatory: true,
              },
              backUpShareFactor: {
                enable: true,
                priority: 2,
                mandatory: false,
              },
              socialBackupFactor: {
                enable: true,
                priority: 3,
                mandatory: false,
              },
              passwordFactor: {
                enable: true,
                priority: 4,
                mandatory: false,
              },
            },
          },
          privateKeyProvider,
        });
        web3auth.configureAdapter(openloginAdapter);

        await web3auth.initModal();

        const solanaAdapter = new SolanaWalletAdapter({
          chainId: "0x3",
        });
        web3auth.configureAdapter(solanaAdapter);

        if (web3auth.connectedAdapterName && web3auth.provider) {
          setProvider(web3auth.provider);
          // Create a SolanaWallet instance using the connected provider
          const solanaWalletInstance = new SolanaWallet(web3auth.provider);
          setSolanaWallet(solanaWalletInstance);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }

    try {
      const web3authProvider = await web3auth.connect();
      // If you need to create a SolanaWallet instance, do it here.
      const solanaWallet = new SolanaWallet(web3authProvider);
      setSolanaWallet(solanaWallet);

      setProvider(web3authProvider);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error during login:", error);
      // Handle the error as needed
    }
  };

  // Function to fetch accounts from Solana Wallet
  const fetchAccounts = async () => {
    if (!solanaWallet) {
      console.log("Solana Wallet not initialized yet");
      return;
    }

    try {
      const accounts = await solanaWallet.requestAccounts();
      console.log("Solana accounts", accounts);

      const connectionConfig = await solanaWallet.request({
        method: "solana_provider_config",
        params: [],
      });

      const connection = new Connection(connectionConfig.rpcTarget);

      // Fetch the balance for the specified public key
      const balance = await connection.getBalance(new PublicKey(accounts[0]));
      setPublik(accounts);

      console.log("Solana balance", balance);
    } catch (error) {
      console.error("Error fetching accounts/balance", error);
    }
  };

  // Function to get the private key from the Solana Wallet
  const getPrivateKey = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }

    try {
      const privateKey = await web3auth.provider.request({
        method: "solanaPrivateKey",
      });
      // Do something with privateKey
      console.log(privateKey);
    } catch (error) {
      console.error("Error getting private key", error);
    }
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    setUserData(user);
    console.log(user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setUserData({});
  };
  const loggedInView = (
    <Main
      getUserInfo={getUserInfo}
      fetchAccounts={fetchAccounts}
      userData={userData}
      isLoggedIn={isLoggedIn}
      publik={publik}
      logout={logout}
    />
  );

  const unloggedInView = (
    <div className="unlogged">
      <Home login={login} />
    </div>
  );

  return (
    <div className="Container-auth">
      {/* /////////////// */}
      <div className="grid">{provider ? loggedInView : unloggedInView}</div>
    </div>
  );
};

export default Auth;
