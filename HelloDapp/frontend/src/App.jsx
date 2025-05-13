import { useState, useEffect } from "react";
import Web3 from "web3";
import HelloWorld from "../../backend/build/contracts/HelloWorld.json";

const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "HTTP://127.0.0.1:7545");
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const netId = await web3.eth.net.getId();
        const deployedNetwork = HelloWorld.networks[netId];
        if (deployedNetwork) {
          const instance = new web3.eth.Contract(HelloWorld.abi, deployedNetwork.address);
          setContract(instance);
          const storedMessage = await instance.methods.getMessage().call();
          setMessage(storedMessage || "No message set");
        } else {
          setMessage("No contract loaded!");
        }
      } catch (error) {
        console.error("Error loading blockchain data:", error);
        setMessage("Hello World");
      }
    };
    loadBlockchainData();
  }, []);

  const updateMessage = async () => {
    if (!contract) return;
    try {
      await contract.methods.setMessage(input).send({ from: account });
      setMessage(input);
      setInput(""); // Clear input after successful update
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <h1>Blockchain DApp</h1>
        <p className="account-info">
          <span>Connected Account:</span> {account || "Not connected"}
        </p>
        <div className="message-display">
          <h2>Message:</h2>
          <p>{message}</p>
        </div>
        <input
          type="text"
          placeholder="Enter new message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="message-input"
        />
        <button
          onClick={updateMessage}
          disabled={!contract}
          className="submit-button"
        >
          Set Message
        </button>
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
      `}</style>
    </div>
  );
};

export default App;