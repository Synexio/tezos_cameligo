#import "../../../contracts/main.mligo" "Contract"

type originated = (
    address *
    (Contract.Parameter.t, Contract.Storage.t) typed_address *
    Contract.Parameter.t contract
)

let bootstrap_accounts () =
    let () = Test.reset_state 5n ([] : tez list) in
    let accounts =
        Test.nth_bootstrap_account 1,
        Test.nth_bootstrap_account 2,
        Test.nth_bootstrap_account 3
    in
    accounts

let initial_storage(initial_admin : address) = {
    admin = initial_admin;
    winner = (None : address option);
    numbers = (Map.empty : Contract.Storage.Types.numbers);
    metadata = (Big_map.empty : Contract.Storage.Types.metadata)
}

let initial_balance = 0mutez

let originate_contract (admin : address) : originated =
    let init_storage = (Test.eval (initial_storage(admin))) in

    let (addr, _code, _nonce) =
    Test.originate_from_file "../../../contracts/main.mligo" "main" (["check_number"] : string list) init_storage initial_balance in

    let actual_storage = Test.get_storage_of_address addr in
    let () = assert(init_storage = actual_storage) in
    let t_addr = Test.cast_address addr in
    let contr = Test.to_contract t_addr in
    (addr, t_addr, contr)