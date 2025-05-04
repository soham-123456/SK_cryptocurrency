App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 750000,
  
  // Sepolia deployment addresses
  tokenAddress: '0x02f7E76d8B8D27ae235f50fb104Fc14A7F66cEa2',
  tokenSaleAddress: '0xC6D54EA62D59c1f35a41C46546BD21f58e12de50',

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("DappTokenSale.json", function(dappTokenSale) {
      App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
      App.contracts.DappTokenSale.setProvider(App.web3Provider);
      
      // Check if we're on Sepolia network
      web3.version.getNetwork((err, netId) => {
        if (netId === '11155111') { // Sepolia network ID
          console.log("Using Sepolia network with hardcoded addresses");
          App.contracts.DappTokenSale.at(App.tokenSaleAddress).then(function(instance) {
            console.log("Dapp Token Sale Address:", instance.address);
          });
        } else {
          App.contracts.DappTokenSale.deployed().then(function(dappTokenSale) {
            console.log("Dapp Token Sale Address:", dappTokenSale.address);
          });
        }
      });
    }).done(function() {
      $.getJSON("DappToken.json", function(dappToken) {
        App.contracts.DappToken = TruffleContract(dappToken);
        App.contracts.DappToken.setProvider(App.web3Provider);
        
        // Check if we're on Sepolia network
        web3.version.getNetwork((err, netId) => {
          if (netId === '11155111') { // Sepolia network ID
            console.log("Using Sepolia network with hardcoded addresses");
            App.contracts.DappToken.at(App.tokenAddress).then(function(instance) {
              console.log("Dapp Token Address:", instance.address);
            });
          } else {
            App.contracts.DappToken.deployed().then(function(dappToken) {
              console.log("Dapp Token Address:", dappToken.address);
            });
          }
        });

        App.listenForEvents();
        return App.render();
      });
    })
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    // Get the current network ID
    web3.version.getNetwork((err, netId) => {
      var tokenSaleInstance;
      
      if (netId === '11155111') { // Sepolia network ID
        tokenSaleInstance = App.contracts.DappTokenSale.at(App.tokenSaleAddress);
      } else {
        App.contracts.DappTokenSale.deployed().then(function(instance) {
          tokenSaleInstance = instance;
        });
      }
      
      if (tokenSaleInstance) {
        tokenSaleInstance.Sell({}, {
          fromBlock: 0,
          toBlock: 'latest',
        }).watch(function(error, event) {
          console.log("event triggered", event);
          App.render();
        });
      }
    });
  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader  = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);
      }
    });

    // Get the current network ID
    web3.version.getNetwork((err, netId) => {
      var getTokenSaleInstance;
      
      if (netId === '11155111') { // Sepolia network ID
        getTokenSaleInstance = App.contracts.DappTokenSale.at(App.tokenSaleAddress);
      } else {
        getTokenSaleInstance = App.contracts.DappTokenSale.deployed();
      }
      
      // Load token sale contract
      getTokenSaleInstance.then(function(instance) {
        dappTokenSaleInstance = instance;
        return dappTokenSaleInstance.tokenPrice();
      }).then(function(tokenPrice) {
        App.tokenPrice = tokenPrice;
        $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
        return dappTokenSaleInstance.tokensSold();
      }).then(function(tokensSold) {
        App.tokensSold = tokensSold.toNumber();
        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);

        var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
        $('#progress').css('width', progressPercent + '%');

        // Get the current network ID
        web3.version.getNetwork((err, netId) => {
          var getTokenInstance;
          
          if (netId === '11155111') { // Sepolia network ID
            getTokenInstance = App.contracts.DappToken.at(App.tokenAddress);
          } else {
            getTokenInstance = App.contracts.DappToken.deployed();
          }
          
          // Load token contract
          getTokenInstance.then(function(instance) {
            dappTokenInstance = instance;
            return dappTokenInstance.balanceOf(App.account);
          }).then(function(balance) {
            $('.dapp-balance').html(balance.toNumber());
            
            // Update token display name
            $('.token-name').html("SK");
            
            App.loading = false;
            loader.hide();
            content.show();
          });
        });
      });
    });
  },

  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = parseInt($('#numberOfTokens').val());
    
    console.log("Buying " + numberOfTokens + " tokens...");
    console.log("Token price: " + App.tokenPrice + " wei");
    console.log("Total cost: " + (numberOfTokens * App.tokenPrice) + " wei");
    
    // Get the current network ID
    web3.version.getNetwork((err, netId) => {
      var getTokenSaleInstance;
      
      if (netId === '11155111') { // Sepolia network ID
        getTokenSaleInstance = App.contracts.DappTokenSale.at(App.tokenSaleAddress);
      } else {
        getTokenSaleInstance = App.contracts.DappTokenSale.deployed();
      }
      
      getTokenSaleInstance.then(function(instance) {
        // Calculate the exact wei value
        var weiValue = numberOfTokens * App.tokenPrice;
        
        return instance.buyTokens(numberOfTokens, {
          from: App.account,
          value: weiValue,
          gas: 500000 // Gas limit
        });
      }).then(function(result) {
        console.log("Tokens bought successfully!");
        console.log(result);
        $('form').trigger('reset') // reset number of tokens in form
        // Wait for Sell event
      }).catch(function(err) {
        console.error("Error buying tokens:", err);
        $('#loader').hide();
        $('#content').show();
        // Display error to user
        alert("There was an error buying tokens. See console for details.");
      });
    });
  },

  connectMetamask: async function() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Update the UI
        App.account = accounts[0];
        $('#accountAddress').html("Your Account: " + App.account);
        
        // Update provider
        App.web3Provider = window.ethereum;
        web3 = new Web3(window.ethereum);
        
        // Refresh the page data
        App.render();
        
        console.log("Connected to MetaMask!");
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', function (accounts) {
          App.account = accounts[0];
          $('#accountAddress').html("Your Account: " + App.account);
          App.render();
        });
        
        // Update button text
        $('#connectMetamask').text('Connected to MetaMask!').prop('disabled', true);
        
      } catch (error) {
        console.error("User denied account access:", error);
        alert("MetaMask connection was denied. Please try again.");
      }
    } else {
      alert("MetaMask is not installed! Please install MetaMask to use this dApp.");
      console.log("MetaMask is not installed!");
    }
  }
}

$(function() {
  $(window).load(function() {
    App.init();
    
    // Set up MetaMask connect button event listener
    $('#connectMetamask').click(function() {
      App.connectMetamask();
    });
  })
});
