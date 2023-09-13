type storage = int list

type parameter =
  Increment of int
| Decrement of int

type return = operation list * storage

// Two entrypoints
let add (store : storage) (delta : int) : int =
    let tail : int =
        match List.head_opt store with
            None -> failwith "Empty storage"
            | Some (x) -> x
    in
    tail + delta

let sub (store : storage) (delta : int) : int =
    let tail : int =
        match List.head_opt store with
            None -> failwith "Empty storage"
            | Some (x) -> x
    in
    tail - delta

let main (action, store : parameter * storage) : return =
  let new_number : int = match action with
      Increment (n) -> add store n
      | Decrement (n) -> sub store n
  in
  let new_store : storage = new_number :: store in
  ([] : operation list), new_store