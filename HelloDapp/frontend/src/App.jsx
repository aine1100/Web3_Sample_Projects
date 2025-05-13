import { useState, useEffect } from "react";
import Web3 from "web3";

import HelloWorld from "../../backend/build/contracts/HelloWorld.json";

const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
        return accounts[0];
      } catch (error) {
        console.error("User denied account access");
        return null;
      }
    } else {
      console.error("Please install MetaMask!");
      return null;
    }
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          
          window.ethereum.on('accountsChanged', function (accounts) {
            setAccount(accounts[0]);
          });

          window.ethereum.on('chainChanged', function () {
            window.location.reload();
          });

          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }

          const netId = await web3.eth.net.getId();
          const deployedNetwork = HelloWorld.networks[netId];
          
          if (deployedNetwork) {
            const instance = new web3.eth.Contract(HelloWorld.abi, deployedNetwork.address);
            setContract(instance);
            const storedMessage = await instance.methods.getMessage().call();
            setMessage(storedMessage || "No message set");
          } else {
            setMessage("No contract loaded! Please make sure you're on the correct network.");
          }
        } catch (error) {
          console.error("Error loading blockchain data:", error);
          setMessage("Error loading contract. Please check your MetaMask connection.");
        }
      } else {
        setMessage("Please install MetaMask to use this dApp!");
      }
    };
    loadBlockchainData();
  }, []);

  const updateMessage = async () => {
    if (!contract) return;
    
    try {
      // If not connected, try to connect first
      if (!isConnected) {
        const connectedAccount = await connectWallet();
        if (!connectedAccount) {
          setMessage("Please connect your MetaMask wallet to continue.");
          return;
        }
      }
      
      await contract.methods.setMessage(input).send({ from: account });
      setMessage(input);
      setInput(""); // Clear input after successful update
    } catch (error) {
      console.error("Transaction failed", error);
      setMessage("Transaction failed. Please try again.");
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <h1>🎮 Blockchain Message Board</h1>
        
        {isConnected && (
          <div className="account-info">
            Connected Account: <span>{account}</span>
          </div>
        )}
       
        <div className="message-display">
          <h2>Current Message:</h2>
          <p>{message}</p>
        </div>
        <input
          type="text"
          placeholder="Enter new message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="message-input"
        />
        <div className="button-group">
          <button
            onClick={updateMessage}
            disabled={!contract}
            className="submit-button"
          >
            Update Message
          </button>
          <button
            onClick={() => {
              setMessage("");
              window.location.reload();
            }}
            className="refresh-button"
          >
            Refresh
          </button>
        </div>
      </div>

      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
          overflow:'hidden';
        }

        .app-wrapper {
          width: 100vw;
          min-height: 100vh;
          background: linear-gradient(135deg, #e0e7ff, #dbeafe, #e0f2fe);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px;
        }

        .app-container {
          background: #ffffff;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
          transition: box-shadow 0.3s ease;
        }

        .app-container:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        }

        h1 {
          font-size: 2rem;
          color: #1f2937;
          margin-bottom: 24px;
          font-weight: 700;
          letter-spacing: -0.025em;
        }

        .account-info {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 24px;
          word-wrap: break-word;
          background: #f3f4f6;
          padding: 8px;
          border-radius: 8px;
        }

        .account-info span {
          font-weight: 500;
          color: #374151;
        }

        .message-display {
          background: #eef2ff;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          border: 1px solid #e0e7ff;
        }

        .message-display h2 {
          font-size: 1.125rem;
          color: #4f46e5;
          margin: 0 0 8px 0;
          font-weight: 600;
        }

        .message-display p {
          color: #1f2937;
          margin: 0;
          word-wrap: break-word;
        }

        .message-input {
          background: #f3f4f6;
          width: 370px;
          padding: 12px 10px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .message-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }

        .connect-button {
          width: 100%;
          padding: 12px;
          background: #4f46e5;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
          margin-bottom: 24px;
        }

        .connect-button:hover {
          background: #4338ca;
        }

        .connect-button:active {
          background: #3730a3;
          transform: scale(0.98);
        }

        .submit-button {
          width: 100%;
          padding: 12px;
          background: #4f46e5;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
          margin-bottom: 0;
        }

        .submit-button:hover:not(:disabled) {
          background: #4338ca;
        }

        .submit-button:active:not(:disabled) {
          background: #3730a3;
          transform: scale(0.98);
        }

        .submit-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .button-group {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .refresh-button {
          width: 100%;
          padding: 12px;
          background: #10b981;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
        }
        .refresh-button:hover:not(:disabled) {
          background: #059669;
        }
        .refresh-button:active:not(:disabled) {
          background: #047857;
          transform: scale(0.98);
        }
        .refresh-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default App;