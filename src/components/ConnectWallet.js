import React, { useState } from "react";
import styles from "./styles/connectWallet.module.scss";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import ReactModal from "react-modal";


const ConnectYourWalletButton = ({ connect, count }) => {
  console.log(count)

  return (
    <div className={styles.container}> 
        { count ? <ErrorMessage /> : <ConnectButton connect = { connect } /> }
    </div>
  )
}

const ConnectButton = ( { connect } ) => {
  return (
    <div className={styles.container}> 
        <button className={styles.connect} onClick={ connect }>Connect Wallet</button>
    </div>
  )
}

const ErrorMessage = () => {
  // if (!message) return null;
  return (
    <div className={styles.chainError}> 
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="Web3Status__NetworkIcon-sc-wwio5h-6 gOHOUP"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>

      &nbsp; Wrong Network 
    </div> 
  );
}

const AddressModal = ( { address } ) => {
  const shorthand = address.substring(0,6) + '...' + address.substring(address.length - 4);

  return (
    <>
      <div className={styles.addr}>
        { shorthand } 
        <div className={styles.jazzIcon}><Jazzicon diameter={22} seed={jsNumberForAddress(address)} /></div>
      </div>
    </>
  )
}



const WalletDetails = () => {
  const { active, account, chainId } = useWeb3React(); 
  // const [error, setError] = useState(false);


  return (
    <>
      <AddressModal address = { account } />
    </>
          // {/* <div className="jazz-icon"><Jazzicon diameter={18} seed={jsNumberForAddress(address)} /></div> */}
  )
};




function activateInjectedProvider(providerName) {
  const { ethereum } = window;

  if (!ethereum?.providers) {
    return undefined;
  }

  let provider;
  switch (providerName) {
    case "CoinBase":
      provider = ethereum.providers.find(
        ({ isCoinbaseWallet }) => isCoinbaseWallet
      );
      break;
    case "MetaMask":
      provider = ethereum.providers.find(({ isMetaMask }) => isMetaMask);
      break;
  }

  if (provider) {
    ethereum.setSelectedProvider(provider);
  }
}


function ChainModal(props)  {
  <div className={styles.alert}>
    <strong>Wrong Network</strong>
    Please connect to Gnosis (formerly xDai) chain in your wallet.
  </div>
}

// function checkChain({ chainId }) {
//   const [chainError, setChainError] = useState(false);

//   if (chainId != 100) setChainError(true);

//   return chainError;
// }

function WalletModal(props) {
  const { activate, chainId } = useWeb3React();

  ReactModal.setAppElement("#root");
  return (
    <ReactModal
      isOpen={props.show}
      className={styles.content}
      overlayClassName={styles.overlay}
      onRequestClose={props.toggleModal}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <div className={styles.walletBox}>
        <div className={styles.head}>
          <div className={styles.ask}>Connect a wallet</div>
          <button className={styles.closeBtn} onClick={props.toggleModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>
        </div>
        <div className={styles.wallets}>
          <button
            className={styles.wallet}
            onClick={async () => {
              activateInjectedProvider("MetaMask");
              await activate(
                new InjectedConnector({
                  supportedChainIds: [100],
                })
              );
              props.toggleModal();
              props.toggleChain();
            }}
          >
            <div>{window.ethereum ? "Metamask" : "Install Metamask"}</div>
            <div>
              <img
                src="./images/metamask.png"
                alt="Metamask"
                width={"24px"}
                height={"24px"}
              />
            </div>
          </button>
          <button
            className={styles.wallet}
            onClick={async () => {
              await activate(
                new WalletConnectConnector({
                  infuraId: undefined,
                  rpc: {
                    100: "https://dai.poa.network/",
                  },
                  chainId: 100,
                })
              );
                props.toggleModal();
            }}
          >
            <div>WalletConnect</div>
            <div>
              <img
                src="./images/walletconnect.svg"
                alt="WalletConnect"
                width={"24px"}
                height={"24px"}
              />
            </div>
          </button>
          <button
            className={styles.wallet}
            onClick={async () => {
              activateInjectedProvider("CoinBase");
              await activate(
                new InjectedConnector({
                  supportedChainIds: [100],
                })
              );
              props.toggleModal();
            }}
          >
            <div>Coinbase Wallet</div>
            <div>
              <img
                src="./images/coinbase.svg"
                alt="WalletConnect"
                width={"24px"}
                height={"24px"}
              />
            </div>
          </button>
          {/* <button
            className={styles.wallet}
            onClick={async () => {
              await activate(
                new FortmaticConnector({
                  apiKey: process.env.REACT_APP_FORTMATIC,
                  chainId: 100,
                })
              );
              if (chainId != 100) alert("Please change to XDAI Chain");
            }}
          >
            <div>Fortmatic</div>
            <div>
              <img
                src="./images/fortmatic.png"
                alt="WalletConnect"
                width={"24px"}
                height={"24px"}
              />
            </div>
          </button> */}
          <button
            className={styles.wallet}
            onClick={async () => {
              await activate(
                new PortisConnector({
                  dAppId: process.env.REACT_APP_PORTIS,
                  networks: [100],
                })
              );
              props.toggleModal();
            }}
          >
            <div>Portis</div>
            <div>
              <img
                src="./images/portis.png"
                alt="WalletConnect"
                width={"24px"}
                height={"24px"}
              />
            </div>
          </button>
            {/* { chainError ? <div className={styles.alert}><strong>Wrong Network</strong> Please connect to Gnosis chain in your wallet</div> : "" } */}
        </div>
      </div>
    </ReactModal>
  );
}




export default function ConnectWallet() {
  const { account, active, deactivate, library, chainId } = useWeb3React();
  const [modal, setModal] = useState(false);
  const [chainError, setChainError] = useState(false);
 
  function toggleChain() {
    setChainError(true);
    console.log("toggle the chain");
  }

  function toggleModal() {
    if (modal) document.body.style.overflow = "visible";
    if (!modal) document.body.style.overflow = "hidden";
    setModal((modal) => !modal);
    // setChainError(true);
    // console.log(chainError);
  }

  return (
    <>
      {/* { !active ? <ConnectYourWalletButton connect={toggleModal} /> : <WalletDetails address={ address } donuts={ donutBalance } /> } */}
      <div className={styles.container}>
        <div className={styles.chain}><img src="./images/gnosis_logo.png" alt="" className={styles.chainLogo} /> Gnosis </div>
        { !active ? <ConnectYourWalletButton connect={ toggleModal } count={chainError} /> : <WalletDetails /> }
        {/* <div className={styles.dropdown}> <img src="./images/icons.svg" alt="..." width="25px" /> </div> */}
      </div>
      
      { modal ? <WalletModal show={ modal } toggleModal={ toggleModal } toggleChain={toggleChain} /> : <></> }
      {/* {!active ? (
        <div>
          <button onClick={toggleModal} className={styles.connect}>
            Connect Wallet
          </button>
          <WalletModal show={modal} toggleModal={toggleModal}></WalletModal>
        </div>
      ) : (
        // <div style={{ display: "flex", flexDirection: "column" }}>
        //   <button className={styles.connect} onClick={deactivate}>
        //     Connected
        //   </button>
        //   <button className={styles.connect} onClick={sign}>
        //     Sign
        //   </button>
        //   <button className={styles.connect} onClick={send}>
        //     Send
        //   </button>
        // </div>
        // <WalletDetails></WalletDetails>
        <button onClick={deactivate} className={styles.connect}>
          Disconnect
        </button>
      )} */}
    </>
  );
}

