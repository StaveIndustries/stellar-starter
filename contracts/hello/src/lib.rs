#![no_std]
// Minimal Soroban "hello" contract: stores a greeting per caller.
// Build: stellar contract build | Test: cargo test | Deploy: see README below.
use soroban_sdk::{contract, contractimpl, Address, Env, IntoVal, Map, String, Symbol, symbol_short};

/// Storage key for the greetings map.
const GREETINGS: Symbol = symbol_short!("greetings");

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    /// Store a greeting for the caller. Requires the caller's signature.
    pub fn set_greeting(env: Env, caller: Address, greeting: String) {
        // Only the caller themself can set their own greeting.
        caller.require_auth();
        // Load the map (or start empty), insert, save back.
        let mut map: Map<Address, String> =
            env.storage().persistent().get(&GREETINGS).unwrap_or(Map::new(&env));
        map.set(caller, greeting);
        env.storage().persistent().set(&GREETINGS, &map);
    }

    /// Read back the caller's greeting (empty string when never set).
    pub fn get_greeting(env: Env, caller: Address) -> String {
        let map: Map<Address, String> =
            env.storage().persistent().get(&GREETINGS).unwrap_or(Map::new(&env));
        map.get(caller).unwrap_or(String::from_str(&env, ""))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, MockAuth, MockAuthInvoke};

    #[test]
    fn set_and_get_roundtrip() {
        // Set up an in-memory test ledger (no network needed).
        let env = Env::default();
        let id = env.register(HelloContract, ());
        let caller = Address::generate(&env);
        let client = HelloContractClient::new(&env, &id);

        // Empty before anything is stored.
        assert_eq!(client.get_greeting(&caller), String::from_str(&env, ""));

        // Store requires auth - mock it so the test passes.
        env.mock_auths(&[MockAuth {
            address: &caller,
            invoke: &MockAuthInvoke {
                contract: &id,
                fn_name: "set_greeting",
                args: (caller.clone(), String::from_str(&env, "hi")).into_val(&env),
                sub_invokes: &[],
            },
        }]);

        // Roundtrip: what we store is what we read.
        client.set_greeting(&caller, &String::from_str(&env, "hi"));
        assert_eq!(client.get_greeting(&caller), String::from_str(&env, "hi"));
    }
}
