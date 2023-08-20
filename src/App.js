import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import background from "./styles/bg.png";
import styled from "styled-components";
import Accordion from './Accordion';
import styles from "./App.css"

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  letter-spacing: 2px;
  font-family: 'Saira', sans-serif;
  border-radius: 20px;
  border: none;
  background-color: #ff9a18;
  font-weight: bold;
  font-size: 30px;
  color: var(--accent-text);
  width: 350px;
  cursor: pointer;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledButton2 = styled.button`
  letter-spacing: 2px;
  font-family: 'Saira', sans-serif;
  border-radius: 15px;
  border: none;
  background-color: var(--bnb);
  font-weight: bold;
  font-size: 30px;
  color: var(--accent-text);
  padding: 20px;
  width: 200px;
  cursor: pointer;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;


export const StyledRoundButton2 = styled.button`
  background: transparent;
  border-radius: 100%;
  border: none;
  padding: 10px;
  font-weight: bold;
  font-size: 30px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
`;

export const StyledLogo = styled.img`
  width: 100px;
  transition: width 0.5s;
  transition: height 0.5s;
`;


export const StyledImg = styled.img`
  border-radius: 30px;
  @media (min-width: 1000px) {
    width: 1500px;
  }
  transition: width 0.5s;
`;

export const StyledImgNav = styled.img`
`;

export const StyledImg2 = styled.img`
  border-radius: 20px;
  @media (min-width: 1000px) {
    width: 400px;
  }
  transition: width 0.5s;
`;

export const StyledImg3 = styled.img`
  width: 100%;
  transition: transform 1s;
  :hover {
    transform: translateZ(10px);
  }
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;




function App() {
  const accordionData = [
    {
      title: 'What is opBNB?',
      content: `OpBNB is designed based on the Optimism OP Stack, an open source codebase, with modifications to meet the needs of BSC.
      The optimizations enable opBNB to allegedly achieve 4,000 transactions per second on the chain and keep transaction fees on the chain to a mere USD 0.005.
      `
    },
    {
      title: 'What is this project?',
      content: `
      opBNB Punks are a collection of 4,444 uniquely generated Punk characters NFTs living on the opBNB Chain.
            Every Punk has distinctive attributes, which are determined by a rarity system.`
    },
    {
      title: 'How to add the network?',
      content: `You can use https://chainlist.org/ and search for opBNB to add the network automatically.
      `
    },
    {
      title: 'How to bridge?',
      content: `First you need BNB to bridge that you have to deposit into your metamask wallet address, it can be done with exchanges. You can bridge from BNB Smart Chain Mainnet at the official bridge site:
      https://opbnb-bridge.bnbchain.org/deposit
      `
    },
    {
      title: 'How to mint?',
      content: `Once you add and connected to the opBNB Network correctly, and you have your BNB bridged from BNB Smart Chain Mainnet to the opBNB Mainnet. You can go to our mint section above and select how many opPunks you want to mint!`
    },
    {
      title: 'How much supply and mint cost?',
      content: `There will be 4444 opBNB Punks with a total mint cost of 0.015 BNB.
      We want to make it cheap so everyone can access to a Punk on the opBNB Network!`
    },
    {
      title: "I've already minted... now what?",
      content: `Welcome to our community! now you are part of the world of the Punks on the opBNB Chain! You will be able to see your NFTs soon on our wallet viewer but for now you can view it on Metamask! As a holder you will have access to the presale of our next $opPUNK token which will be used on our future NFT staking. Stay tuned!`
    },
    
  ];
  const dispatch = useDispatch();
  const ref = useRef(null);
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [isActive, setIsActive] = useState(false);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`How many opPunks you want to mint?`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = 15000000000000000;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    let totalCostWeiNum = cost * mintAmount
    let trueCost = BigInt(totalCostWeiNum).toString();
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: trueCost,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Something went wrong. Try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Congratulations! You minted ${mintAmount} ${CONFIG.NFT_NAME}!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);


  const handleFaq = () => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
  };

 const handleTwitter = () => {
    window.open(
      'https://twitter.com/opPunksBNB',
      '_blank'
    );
  };

  const handleTelegram = () => {
    window.open(
      'https://t.me/opBNB_punks',
      '_blank'
    );
  };


  return (
    <s.Screen>

      <div className="main" style={{display:"flex", 
      backgroundColor: "var(--bg)",
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
      flex: "1",
      ai: "1"
       }}>

<s.Container
        ai={"center"}>

        <div className="nav" style={{display:"flex", marginLeft: "250px"}}>
          <div className="logo">

       <StyledImg
        src={"/config/images/logo.png"}
        style={{
          width: "300px",
          height: "105px",
          marginLeft: "-250px",
          marginTop: "50px",
        }}
        
        />
          </div>
          
         <div className="bar" style={{display:"flex", marginLeft: "0px"}}>

          <div className="option2" style={{marginLeft:"400px"}}>
          <s.TextNav
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              letterSpacing: 4,
              color: "var(--accent)",
              marginTop: "80px",
              cursor: "pointer"
              }}
            >
              MY NFTS
       </s.TextNav>
          </div>

          <div className="option2" style={{marginLeft:"80px"}}>
          <s.TextNav
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              letterSpacing: 4,
              color: "var(--accent)",
              marginTop: "80px",
              cursor: "pointer"
              }}
            >
              NFT MARKETPLACE
       </s.TextNav>
          </div>

          <div className="option3" style={{marginLeft:"80px"}} onClick={handleFaq} >
          <s.TextNav
            style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                letterSpacing: 4,
                color: "var(--accent)",
                marginTop: "80px",
                cursor: "pointer",
                
              }}
            >
              FAQ
       </s.TextNav>
</div>
           <div className="option3" style={{marginLeft:"80px", marginTop: "80px"}} onClick={handleTelegram} >
          <StyledImgNav
        src={"/config/images/tg.png"}
        style={{
          width: "100%",
          cursor: "pointer",
        }}
        
        />
          </div>

          <div className="option3" style={{marginLeft:"80px", marginTop: "80px"}} onClick={handleTwitter} >
          <StyledImgNav
        src={"/config/images/tw.png"}
        style={{
          width: "100%",
          cursor: "pointer",
        }}
        />
          </div>
          </div>  
       </div>

       <s.SpacerLargeX />
       <s.SpacerMedium />

<div class="main" style={{marginLeft:"100px", display:"flex"} }>
  <div class="banner" style={{marginRight:"100px"}}>
       <StyledImg
        src={"/config/images/banner2.png"}
        style={{
          width: "665px",
          height: "420px",
        }}
        
        />
        <s.SpacerLarge />
       <s.TextTitle 
       style={{
          fontSize: 60,
          fontWeight: "bold",
          textAlign: "center",
       }}>
          The <b>opPunks</b> arrived 
        </s.TextTitle>
       <s.TextTitle 
       style={{
          fontSize: 55,
          fontWeight: "bold",
          textAlign: "center",
       }}>
          to the opBNB Chain
        </s.TextTitle>
  </div>

  <div class="mint" style={{display:"flex"}}>

  <div class="gif">
      <StyledImg2 
            src={"/config/images/gif.gif"}
            style={{
              marginTop: "110px",
              boxShadow: "0px 1px 2px 5px rgba(0,0,0,0.1)",
            }}
          />
      </div>
   
        <s.Container2
          display={"flex"}
          style={{
            marginLeft: "40px",
            borderRadius: 20,
          }}
        >

      

      <div class="minting">
      <s.Container flex={1} jc={"center"} ai={"center"}
      style={{
        marginRight: "200px",
        marginTop: "10px",
      }}>
          <s.TextTitle
            style={{
              fontSize: 60,
              fontWeight: 1000,
              letterSpacing: 12,
              color: "var(--bnb)",
              textAlign: "center",
            }}
          >
            opPunks
          </s.TextTitle>
          <s.TextDescription
            style={{
              fontSize: 20,
              fontWeight: 1000,
              letterSpacing: 2,
              color: "var(--accent)",
              textAlign: "center",
            }}
          >
            opBNB Punks are a collection of 4,444 uniquely generated Punk characters living on the opBNB Chain.
            Every Punk has distinctive attributes, which are determined by a rarity system.
          </s.TextDescription>
          <s.SpacerMedium />
          <s.TextTitle
            style={{
              fontSize: 50,
              fontWeight: 1000,
              letterSpacing: 12,
            }}
          >
            Mint live
          </s.TextTitle>

          {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
            <>
             <s.SpacerXSmall />
              <s.TextTitle
                style={{ textAlign: "center", color: "var(--accent-text)" }}
              >
                The sale has ended.
              </s.TextTitle>
              
            </>
          ) : (
            <>
              <s.TextTitle2
                style={{ textAlign: "center", color: "var(--accent-text)", fontSize: 25 }}
              >
                
              Price: 0.015 BNB | {data.totalSupply} minted of {CONFIG.MAX_SUPPLY}
              </s.TextTitle2>
              <s.SpacerMedium />
              <s.TextTitle2
                style={{ textAlign: "center", color: "var(--accent-text)", fontSize: 28 }}
              >
                
              </s.TextTitle2>
              {blockchain.account === "" ||
              blockchain.smartContract === null ? (
                <s.Container ai={"center"} jc={"center"}>
                  
                  <StyledButton2
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(connect());
                      getData();
                    }}
                    style={{ marginLeft: "-8px" }}
                  >
                    Connect
                  </StyledButton2>
                  

                  {blockchain.errorMsg !== "" ? (
                    <>
                  <s.SpacerSmall />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent)",
                          letterSpacing: 2
                        }}
                      >
                        
                      Connect to opBNB Network
                      </s.TextDescription>
                      
                    </>
                  ) : null}
                </s.Container>
              ) : (
                <>
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >
                    
                    {feedback}
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledRoundButton2
                      style={{ lineHeight: 0.4, color: "var(--accent)"}}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        decrementMintAmount();
                      }}
                    >
                      -
                    </StyledRoundButton2>
                    <s.SpacerMedium />
                    
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent)"
                      }}
                    >
                      {mintAmount}
                    </s.TextDescription>
                    
                    <s.SpacerMedium />
                    <StyledRoundButton2
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        incrementMintAmount();
                      }}
                      style={{
                        color: "var(--accent)"
                      }}
                    >
                      +
                    </StyledRoundButton2>
                  </s.Container>
                  
                  
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledButton2
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                      }}
                    >
                      {claimingNft ? "Busy" : "Mint"}
                    </StyledButton2>
                    
                  </s.Container>
                </>
              )}
            </>
          )}
          </s.Container>
      </div> 
          
        </s.Container2>

  </div>
</div>

<s.SpacerLargeXX />

<div className="grid" style={{display:"flex"}}>
<StyledImg
        src={"/config/images/grid.png"}
        style={{
          marginLeft: "20px"
        }}
        />

</div>

<s.SpacerLargeXX />

<div className="info" ref={ref}>

</div>

<s.TextTitle 
      style={{
        fontSize: 60,
        textAlign: "center",
        letterSpacing: 5
      }}
      >
        Team
      </s.TextTitle>
      <s.SpacerLarge />


      <div className="team" style={{display:"flex"}}>
      <div class="tm" style={{
        marginRight: 300,
        marginLeft: 40
        }}>
      <StyledImg
        src={"/config/images/dev.png"}
        style={{
          width: "300px",
          marginLeft: 60,
        }}
        
        />
        <s.TextSubTitle
        style={{
          fontSize: 60,
        }}>
          Jack
        </s.TextSubTitle>
        <s.TextSubTitle
        style={{
          fontSize: 15,
          marginTop: -18,
        }}>
          Developer
        </s.TextSubTitle>
        <s.TextSubTitle
        style={{
          fontSize: 20,
          textAlign: "center",
          marginTop: 30,
        }}>
          Developing in Web3 since 2021 at networks 

        </s.TextSubTitle>
        <s.TextSubTitle
        style={{
          fontSize: 20,
          textAlign: "center",
        }}>
          such as Binance Smart Chain, Tron, Polygon
        </s.TextSubTitle>
        <s.TextSubTitle
        style={{
          fontSize: 20,
          textAlign: "center",
        }}>
          and Avalanche. Worked at them as a Back-end
        </s.TextSubTitle>

        <s.TextSubTitle
        style={{
          fontSize: 20,
          textAlign: "center",
        }}>
        developer and now progressing into the Front-end.
        </s.TextSubTitle>
        
      </div>
      <div class="tm">
      <StyledImg
        src={"/config/images/des.png"}
        style={{
          width: "300px",
          marginLeft: 35,
        }}
        
        />
        <s.TextSubTitle
        style={{
          fontSize: 60,
        }}>
          Hart
        </s.TextSubTitle>
        <s.TextSubTitle
        style={{
          fontSize: 15,
          marginTop: -18,
        }}>
          Community Manager
        </s.TextSubTitle>
        <s.TextSubTitle
        style={{
          fontSize: 20,
          textAlign: "center",
          marginTop: 30,
        }}>
          His early motivation on the Web3 made him 
        </s.TextSubTitle>
        <s.TextSubTitle
        style={{
          fontSize: 20,
          textAlign: "center",
        }}>
          to get involved more and more into the new 
        </s.TextSubTitle>
        <s.TextSubTitle
        style={{
          fontSize: 20,
          textAlign: "center",
        }}>
          projects emerging, at the point to start working 
        </s.TextSubTitle>

        <s.TextSubTitle
        style={{
          fontSize: 20,
          textAlign: "center",
        }}>
        for the first time at early's 2022 and didn't 
        </s.TextSubTitle>
        <s.TextSubTitle
        style={{
          fontSize: 20,
          textAlign: "center",
        }}>
        stop working since that day!
        </s.TextSubTitle>
      </div>
      

      </div>

      <s.SpacerLargeXX />

<div class="accordion">

{accordionData.map(({ title, content }) => (
  <Accordion title={title} content={content} />
))}

</div>

<s.SpacerLargeXX/>
</s.Container>
      </div>
    </s.Screen>
  );
}

export default App;
