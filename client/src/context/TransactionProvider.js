import {useContext, useEffect, createContext, useState} from "react";
import {ethers, formatEther, parseEther} from "ethers";
import api from "../utils/Api";
import {abi, contractAddress} from "../contract/contract";

export const TransactionContext = createContext(null);

const {ethereum} = window;

export const TransactionProvider = ({children}) => {
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const defaultErrorHandler = (err, msg) => {
    console.log(err);
    const code = err.info ? err.info.error.code : 0;
    if(code === 4001) {
      console.log("ERROR_REJECT>>>")
    } else {
      throw new Error(msg || "Some error!");
    }
  }

  const getSigner = async () => {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    return signer;
  }
  
  const getContract = async () => {
    const contract = new ethers.Contract(contractAddress, abi, await getSigner());
    return contract;
  }
  
  const getTopLikedPosts = async (amount = 5) => {
    if (!ethereum) return alert("Please install Metamask!");

    const cryfteriaContract = await getContract();

    const postsRaw = await cryfteriaContract.getTopDonatedPosts(amount);
    const posts = postsRaw.map(post => ({hashKey: post.hashKey.toString(16), donated: +formatEther(post.donated), owner: post.owner, id: Number(post.id), price: +formatEther(post.price)}));

    console.log("TOP_POSTS>>>", posts);
    return posts.sort((a, b) => a.donated > b.donated ? -1 : a.donated < b.donated ? 1 : 0);
  }
  
  const createPost = async (hashKey) => {
    console.log("KEY>>>", hashKey, BigInt("0x" + hashKey));
    try {
      if (!ethereum) return alert("Please install Metamask!");
      
      // todo check if hashKey present
      
      const cryfteriaContract = await getContract();
      
      const numberKey = BigInt("0x" + hashKey);
      
      const transactionHash = await cryfteriaContract.createPost(numberKey);

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);

      await transactionHash.wait();

      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);
    } catch (err) {
      defaultErrorHandler(err, "Some error in CREATE_POST");
    }
  }
  
  const setPostToSell = async (postId, price) => {
    try {
      if (!ethereum) return alert("Please install Metamask!");
      // todo  check if price is valid

      const parsedAmount = parseEther(price);
      const contract = await getContract();

      const transactionHash = await contract.setPostForSell(postId, parsedAmount);

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);

      await transactionHash.wait();

      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);
      
    } catch (err) {
      
    }
  }
  
  const buyPost = async (postId, price) => {
    try {
      if (!ethereum) return alert("Please install Metamask!");
      // todo  check if price is valid

      const parsedAmount = parseEther(price);
      const contract = await getContract();

      console.log("BUY>>>", postId, price)
      const transactionHash = await contract.buyPost(postId, {value: parsedAmount});
      console.log("BUY2>>>", postId, price)

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);

      await transactionHash.wait();

      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);
    } catch (err) {
      defaultErrorHandler(err, "Some error in BUY_POST");
    }
  }
  
  const getPostById = async (id) => {
    if (!ethereum) return alert("Please install Metamask!");
    
    // todo check if id present
    
    const cryfteriaContract = await getContract();
    const post = await cryfteriaContract.getPostById(id);
    const newPost = ({hashKey: post.hashKey.toString(16), donated: +formatEther(post.donated), owner: post.owner, id: Number(post.id), price: +formatEther(post.price)});
    
    console.log("POST>>>", post, newPost);
    return newPost;
  }
  
  const getPostsForUser = async (address) => {
    if (!ethereum) return alert("Please install Metamask!");
    
    const cryfteriaContract = await getContract();
    const postsRaw = await cryfteriaContract.getPostsByOwner(address);
    const posts = postsRaw.map(post => ({hashKey: post.hashKey.toString(16), donated: +formatEther(post.donated), owner: post.owner, id: Number(post.id), price: +formatEther(post.price)}));
    
    console.log("POSTS>>>", posts);
    return posts.reverse();
  }
  
  const donate = async (postId, amount) => {
    try {
      if (!ethereum) return alert("Please install Metamask!");

      const parsedAmount = parseEther(amount);
      
      const contract = await getContract();
      const transactionHash = await contract.donate(postId, {value: parsedAmount});

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);

      await transactionHash.wait();

      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);
    } catch (err) {
      defaultErrorHandler(err, "Some error in DONATE");
    }
  }
  
  const signFunction = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const signer = await getSigner();
        const account = await signer.getAddress();
        setCurrentAddress(account);

        const nonce = (await api.get(`/auth/nonce/${account}`)).data;
        const signature = await signer.signMessage(nonce);

        api.post("/auth/authenticate", {
          publicAddress: account,
          signature: signature
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          console.log(JSON.stringify(res.data));
          resolve(res);
        })
      } catch (err) {
        reject(err);
      }
    });
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask!");

      const signer = await getSigner();

      const account = await signer.getAddress();

      setCurrentAddress(account);
    } catch (err) {
      defaultErrorHandler(err, "Some error in connectWallet");
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask!")

      const accounts = await ethereum.request({method: "eth_accounts"});

      if (accounts.length > 0) {
        setCurrentAddress(accounts[0]);

        // getAllTransactions()
      } else {
        console.log("No accounts found")
      }
    } catch (err) {
      console.log(err);

      throw new Error("Not ethereum object");
    }
  }
  
  return (
    <TransactionContext.Provider value={{
      signFunction, 
      currentAddress, 
      connectWallet, 
      createPost,
      getPostById, 
      getPostsForUser, 
      donate,
      getTopLikedPosts,
      setPostToSell,
      buyPost
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransaction = () => {
  return useContext(TransactionContext);
}