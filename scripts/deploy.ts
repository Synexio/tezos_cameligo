import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
import { char2Bytes } from "@taquito/utils";
import { outputFile } from "fs-extra";

import * as dotenv from 'dotenv';
import code from "../compiled/main.json";
import metadata from "./metadata.json";
import networks from "../config";

dotenv.config(( { path: '.env' } ));
let TezosNodeRPC: string;
switch(process.env.TEZOS_NODE_URL) {
    case "SANDBOX": {
        TezosNodeRPC = networks.sandbox.node_url;
        break;
    }
    case "GHOSTNET": {
        TezosNodeRPC = networks.ghostnet.node_url;
        break;
    }
    default: {
        //mainnet;
        TezosNodeRPC = networks.mainnet.node_url;
        break;
    }
}
const publicKey : string = process.env.ADMIN_PUBLIC_KEY;
const privateKey : string = process.env.ADMIN_PRIVATE_KEY;

const signature = new InMemorySigner(privateKey);
const Tezos = new TezosToolkit(TezosNodeRPC);
Tezos.setProvider({ signer: signature });

Tezos.tz.getBalance(publicKey)
    .then((balance) => console.log(`Address Balance : ${balance.toNumber() / 1000000} ꜩ`))
    .catch((error) => console.log(JSON.stringify(error)));

const savedContractAdress = (name : string, address : string) => {
    outputFile(`scripts/deployments/${name}.ts`,
        `export default "${address}"`);
}

const deploy = async () => {
    try {
        const storage = {
            admin : publicKey,
            winner : null,
            numbers : new MichelsonMap(),
            metadata : MichelsonMap.fromLiteral({
                "" : char2Bytes("tezos-storage:jsonfile"),
                "jsonfile" : char2Bytes(JSON.stringify(metadata))
            }),
        }
        const origination = await Tezos.contract.originate({
            code : code,
            storage: storage
        });
        console.log(`Contract originated at : ${origination.contractAddress}`);
        savedContractAdress("deployed_contract",origination.contractAddress);

    }
    catch (error) {
        console.log(error)
    }


}

deploy()