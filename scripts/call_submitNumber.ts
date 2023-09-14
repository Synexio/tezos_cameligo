import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
import { char2Bytes } from "@taquito/utils";
import  contractAddress from "./deployments/deployed_contract"

import networks from "../config";
import accounts from "../account"



import * as dotenv from 'dotenv';
import code from "../compiled/main.json";
import metadata from "./metadata.json";

dotenv.config(( { path: '.env' } ));

let TezosNodeRPC: string;
if(process.env.TEZ_NETWORK == "mainnet") {
    console.log("WARNING : You are about to deploy to mainnet. Press CTRL+C to abort.");
} else {
    const TezosNodeRPC : string = networks[process.env.TEZ_NETWORK || ''].node_url;
    console.log(`Tezod Node RPC : ${TezosNodeRPC}`);
    const publicKey : string = accounts[process.env.TEZ_NETWORK || ''].bob.publicKey;
    const privateKey : string = accounts[process.env.TEZ_NETWORK || ''].bob.privateKey;
}

//const publicKey : string = accounts.sandbox.bob.publicKey;
//const privateKey : string = accounts.sandbox.bob.privateKey;

const signature = new InMemorySigner(privateKey);
const Tezos = new TezosToolkit(TezosNodeRPC);
Tezos.setProvider({ signer: signature });

Tezos.tz.getBalance(publicKey)
    .then((balance) => console.log(`Address Balance : ${balance.toNumber() / 1000000} ꜩ`))
    .catch((error) => console.log(JSON.stringify(error)));

const call_submitNumber = async () => {
    try {
        const instance = await Tezos.contract.at(contractAddress);
        const op = await instance.methodsObject.submitNumber(2).send()
        console.log(`Hash : ${op.hash}`);
    }
    catch (error) {
        console.log(error)
    }


}

call_submitNumber()