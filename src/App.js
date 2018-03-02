import React, {Component} from 'react';
import './App.css';
import * as Web3 from 'web3';
import {abi} from "./constant";

const contract_address = '0x9fe082e6F2804361aD195d60552336aEF1De54FC';

let web3 = null;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            contract: undefined,
            slots: [],
            currentSlot: undefined,
            account: undefined,
            error_message: '',
            description: '',
            price: '',
            image_url: '',
            link: ''
        };
    }

    componentDidMount() {
        if (typeof window.web3 !== 'undefined') {
            web3 = new Web3(window.web3.currentProvider);
        } else {
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }

        web3.eth.net.getId().then((netId) => {
            switch (netId) {
                case 1:
                    console.log('This is mainnet');
                    this.setState({error_message: 'You are using the main network, please switch to Kovan test net.'});
                    return;
                case 2:
                    console.log('This is the deprecated Morden test network.');
                    this.setState({error_message: 'You are using the deprecated Morden test network, please switch to Kovan test net.'});
                    return;
                case 3:
                    console.log('This is the ropsten test network.');
                    this.setState({error_message: 'You are using the ropsten test network, please switch to Kovan test net.'});
                    return;
                case 42:
                    console.log('This is the kovan test network.');
                    break;
                default:
                    console.log('This is an unknown network. id: ' + netId);
                    this.setState({error_message: 'You are using an unknown network, please switch to Kovan test net.'});
                    return;
            }
        });

        web3.eth.getAccounts((error, accounts) => {
            if (error || !accounts[0]) {
                this.setState({error_message: 'Please unlock your account and refresh the page.'});
                return;
            }
            this.setState({account: accounts[0]});
        });

        let contract = new web3.eth.Contract(abi, contract_address, {});
        this.setState({contract: contract}, () => this.fetchSlots());
    }

    fetchSlots() {
        for (let i = 0; i < 100; i++) {
            this.state.contract.methods.getSlot(i).call({}, (error, result) => {
                let newSlots = this.state.slots.slice();
                newSlots[i] = result;
                this.setState({slots: newSlots});
            })
        }
    }

    buySlot() {
        this.state.contract.methods.buySlot(
            this.state.currentSlot,
            this.state.description,
            this.state.image_url,
            this.state.link
        ).send(
            {
                from: this.state.account,
                value: this.state.price
            },
            (error, result) => {
                console.log(error);
                console.log(result);
            }
        )
    }

    render() {
        if (this.state.error_message) {
            return <h1>{this.state.error_message}</h1>;
        }

        let ranges = Array.from(Array(10).keys());

        return (
            <div style={styles.container}>
                <div style={{height: '5%'}}>
                    <h1>Million Dollar Billboard</h1>
                </div>
                <div style={{height: '65%'}}>
                    <table style={styles.table}>
                        <tbody>
                            {ranges.map((row) =>
                                <tr key={row}>
                                    {ranges.map((column) => {
                                        let id = row * 10 + column;
                                        return (
                                            <td style={this.state.currentSlot === id ? styles.selectedSlot : styles.slot}
                                                key={id}
                                                onClick={() => this.setState({currentSlot: id})}>
                                                {this.renderSlot(id)}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div style={{height: '20%'}}>
                    {this.renderCurrentSlot()}
                </div>
            </div>
        );
    }

    renderSlot(id) {
        let slot = this.state.slots[id];
        let price = 0;
        let description = "";
        let image_url = "";
        let alt = "Empty Slot";

        if (slot) {
            price = slot[0];
            description = slot[2];
            image_url = slot[3];
            if (price > 0) {
                alt = "";
            }
        }

        return (
            <img alt={alt} title={description} src={image_url}
            style={styles.image}/>
        )

    }

    renderCurrentSlot() {
        let price = 0;
        let owner = "";
        let description = "";
        let image_url = "";
        let link = "";

        if (this.state.slots && this.state.slots[this.state.currentSlot]) {
            price = this.state.slots[this.state.currentSlot][0];
            owner = this.state.slots[this.state.currentSlot][1];
            description = this.state.slots[this.state.currentSlot][2];
            image_url = this.state.slots[this.state.currentSlot][3];
            link = this.state.slots[this.state.currentSlot][4];
        }

        return (
            <div style={styles.current_slot}>
                <div style={styles.slot_section}>
                    <img style={styles.image} alt="Image Not Exist" src={image_url} />
                </div>
                <div style={styles.slot_section}>
                    <div style={styles.title}>Current Owner</div>
                    <div style={styles.info}>{owner}&nbsp;</div>
                    <div style={styles.title}>Description</div>
                    <div>{description}&nbsp;</div>
                    <div style={styles.title}>Link</div>
                    <a href={link}>click here</a>
                    <div style={styles.title}>Price</div>
                    <div>{price}&nbsp;wei</div>
                </div>
                <div style={styles.slot_section}>
                    <input style={styles.input} type="number" placeholder="Price (wei)" value={this.state.price}
                           onChange={(e) => this.setState({price: e.target.value})}/>
                    <input style={styles.input} type="text" placeholder="Description" value={this.state.description}
                           onChange={(e) => this.setState({description: e.target.value})}/>
                    <input style={styles.input} type="text" placeholder="Image URL" value={this.state.image_url}
                           onChange={(e) => this.setState({image_url: e.target.value})}/>
                    <input style={styles.input} type="text" placeholder="Link" value={this.state.link}
                           onChange={(e) => this.setState({link: e.target.value})}/>
                    <button style={styles.input} onClick={() => this.buySlot()}>Buy</button>
                    <span>Please refresh the page after the transaction is included in the blockchain</span>
                </div>
            </div>
        )
    }
}

export default App;

const styles = {
    container: {
        textAlign: 'center',
        width: '80%',
        minWidth: '1000px',
        marginLeft: '10%',
        marginRight: '10%',
    },
    table: {
        width: '100%',
        backgroundColor: 'grey',
        marginBottom: '20px'
    },
    slot: {
        border: '1px white solid',
        width: 40,
        height: 40,
        cursor: 'pointer'
    },
    selectedSlot: {
        border: '1px solid red',
        width: 40,
        height: 40,
        cursor: 'pointer'
    },
    current_slot: {
        border: '1px black solid',
        width: '100%',
        height: '100%'
    },
    slot_section: {
        width: '30%',
        float: 'left',
        padding: 10
    },
    image: {
        width: '100%',
        height: '100%'
    },
    title: {
        fontSize: 16,
        textAlign: 'left'
    },
    info: {
        fontSize: 12,
    },
    input: {
        width: '100%',
        marginBottom: 10,
    }
}


