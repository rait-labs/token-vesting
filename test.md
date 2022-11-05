
Create participants accounts:

solana-keygen new --outfile ~/.config/solana/id_owner.json --force
solana-keygen new --outfile ~/.config/solana/id_dest.json --force
solana-keygen new --outfile ~/.config/solana/id_new_dest.json --force



Wrote new keypair to /Users/neun/.config/solana/id_owner.json
=========================================================================
pubkey: 4cPvyJzqK1wPfbpJair5jua1DaThRV88Trjw8VhVMKDt
=========================================================================
Save this seed phrase and your BIP39 passphrase to recover your new keypair:
orbit marine can unit auto bread faith search legend glance wrestle cause
=========================================================================

Wrote new keypair to /Users/neun/.config/solana/id_dest.json
===============================================================================
pubkey: 9SHjdQ7H2x6kqXdo7YHWBnF8Vcswu3RQZGrtojPqkx2W
===============================================================================
Save this seed phrase and your BIP39 passphrase to recover your new keypair:
idea emotion file forget weird pause vault hole abstract better unique cupboard
===============================================================================

Wrote new keypair to /Users/neun/.config/solana/id_new_dest.json
========================================================================
pubkey: Aw7jzKzRV2iDtoWuvvFcN2u5ViQTjCBtyTXHM2PfWMor
========================================================================
Save this seed phrase and your BIP39 passphrase to recover your new keypair:
autumn circle battle silk cave damp test poverty camp legal stairs grape
========================================================================


Owner would do all operations, so put some SOL to his account:

solana airdrop 2 --url https://api.devnet.solana.com ~/.config/solana/id_owner.json


cd ./program
cargo build-bpf

solana deploy ../program/target/deploy/token_vesting.so --url https://api.devnet.solana.com --keypair  ~/.config/solana/id_owner.json


Program Id: 6v1e8QJUcQZ9AzGND8denhPtJPwhJbGpP4rsUivC4Kqm


Creating token 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une

Address:  2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une
Decimals:  9

Signature: AUKu4XyuexagiKiknHRqcpiHdx6Dv38JeXZxwKxggo9qAtBJEvU9f35EP2rVSLMNgPzduYyhza1sBkJkEkAZZFn

spl-token create-account $MINT --url https://api.devnet.solana.com --owner ~/.config/solana/id_owner.json --fee-payer  ~/.config/solana/id_owner.json

2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une

spl-token create-account 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une --url https://api.devnet.solana.com --owner ~/.config/solana/id_owner.json --fee-payer  ~/.config/solana/id_owner.json

Creating account C7oQjNLggVVttvkutgaivWuPqmYKoFfVSzoFSxxkFJzD

Signature: 3DQ3TNXaa12o51WK6GJNU17ddD6FuqKsKmxvZjeN5bGVheECohRkzEsR2iFL985dieiitAzk58rm7n3QLkeRt48n

spl-token mint 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une 100000 --url https://api.devnet.solana.com C7oQjNLggVVttvkutgaivWuPqmYKoFfVSzoFSxxkFJzD --fee-payer  ~/.config/solana/id_owner.json

Minting 100000 tokens
  Token: 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une
  Recipient: C7oQjNLggVVttvkutgaivWuPqmYKoFfVSzoFSxxkFJzD

Signature: 2S1ty2PcUGR2Dav8ypNNow3drhXJZt3bUpAMdJX5jY1PswXinzoq3bcPdJ7CDVz8LhYX1pKeN6xPxziogAF1qf8Z

Create vesting destination token account(ACCOUNT_TOKEN_DEST):

spl-token create-account 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une --url https://api.devnet.solana.com --owner ~/.config/solana/id_dest.json --fee-payer  ~/.config/solana/id_owner.json

Creating account APVyauiWahV6tPojkStQ7RSTZiJzSLrmGEGAEGRvEpMe

Signature: 4W8LYjwsEJVZbhN4dHCUM6NC1CWxjTp7JvZ3fUcPKiqYPTLU2MbGHZqXkKSHUbDDAnLwNoc4dDoxq53V68ZKuBzp

spl-token create-account 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une --url https://api.devnet.solana.com --owner ~/.config/solana/id_new_dest.json --fee-payer  ~/.config/solana/id_owner.json

Creating account EQJBQQDGfruPuwGLfQHNePdPA2RU2bsudsyPZoeL8ay9

Signature: 2roQEbDSEp76jK6VxUWE9h9L8ZJMKLxQ8RaSEoAAYqYZwUBH5qkoFCxZwjbcvZwB3S26WAQPbVTcJEiXz7829SkL


echo "RUST_BACKTRACE=1 ./target/debug/vesting-contract-cli      \
--url https://api.devnet.solana.com                             \
--program_id $PROGRAM_ID                                        \
create                                                          \
--mint_address $MINT                                            \
--source_owner ~/.config/solana/id_owner.json                   \
--source_token_address $TOKEN_ACCOUNT_SOURCE                    \
--destination_token_address $ACCOUNT_TOKEN_DEST                 \
--amounts 2,1,3,!                                               \
--release-times 1,28504431,2850600000000000,!                   \
--payer ~/.config/solana/id_owner.json"                         \
--verbose | bash              


$PROGRAM_ID: 6v1e8QJUcQZ9AzGND8denhPtJPwhJbGpP4rsUivC4Kqm
$MINT: 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une
$TOKEN_ACCOUNT_SOURCE: C7oQjNLggVVttvkutgaivWuPqmYKoFfVSzoFSxxkFJzD
$ACCOUNT_TOKEN_DEST: APVyauiWahV6tPojkStQ7RSTZiJzSLrmGEGAEGRvEpMe
$ACCOUNT_TOKEN_NEW_DEST: EQJBQQDGfruPuwGLfQHNePdPA2RU2bsudsyPZoeL8ay9

Create vesting instance and store its SEED value

echo "RUST_BACKTRACE=1 ./target/debug/vesting-contract-cli      \
--url https://api.devnet.solana.com                             \
--program_id 6v1e8QJUcQZ9AzGND8denhPtJPwhJbGpP4rsUivC4Kqm       \
create                                                          \
--mint_address 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une     \
--source_owner ~/.config/solana/id_owner.json                   \
--source_token_address C7oQjNLggVVttvkutgaivWuPqmYKoFfVSzoFSxxkFJzD                    \
--destination_token_address APVyauiWahV6tPojkStQ7RSTZiJzSLrmGEGAEGRvEpMe                 \
--amounts 2,1,3,!                                               \
--release-times 1,28504431,2850600000000000,!                   \
--payer ~/.config/solana/id_owner.json"                         \
--verbose | bash              

The seed of the contract is: 1111111ogCyDbaRMvkdsHB3qfdyFYaG1WtRUAfi5
Please write it down as it is needed to interact with the contract!
The vesting account pubkey: J3aSjQG9wnHnKqe7p2xxjC9EDE4BaA9x6gkzDc7LMV3j

echo "RUST_BACKTRACE=1 ./target/debug/vesting-contract-cli      \
--url https://api.devnet.solana.com                             \
--program_id 6v1e8QJUcQZ9AzGND8denhPtJPwhJbGpP4rsUivC4Kqm       \
info                                                            \
--seed 1111111ogCyDbaRMvkdsHB3qfdyFYaG1WtRUAfi5 " | bash                                          

---------------VESTING--CONTRACT--INFO-----------------

RPC URL: "https://api.devnet.solana.com"
Program ID: 6v1e8QJUcQZ9AzGND8denhPtJPwhJbGpP4rsUivC4Kqm
Vesting Seed: 1111111ogCyDbaRMvkdsHB3qfdyFYaG1WtRUAfi5
Vesting Account Pubkey: J3aSjQG9wnHnKqe7p2xxjC9EDE4BaA9x6gkzDc7LMV3j
Vesting Token Account Pubkey: HPDhdUGGySCTzE6hLcKGWXd1MwPoGMJD3GeyhNtcP2s9
Initialized: true
Mint Address: 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une
Destination Token Address: APVyauiWahV6tPojkStQ7RSTZiJzSLrmGEGAEGRvEpMe

SCHEDULE 0
Release Height: 1
Amount: 2

SCHEDULE 1
Release Height: 28504431
Amount: 1

SCHEDULE 2
Release Height: 2850600000000000
Amount: 3


echo "RUST_BACKTRACE=1 ./target/debug/vesting-contract-cli      \
--url https://api.devnet.solana.com                             \
--program_id 6v1e8QJUcQZ9AzGND8denhPtJPwhJbGpP4rsUivC4Kqm                                        \
unlock                                                          \
--seed 1111111ogCyDbaRMvkdsHB3qfdyFYaG1WtRUAfi5                                                    \
--payer ~/.config/solana/id_owner.json" --verbose | bash


echo "RUST_BACKTRACE=1 ./target/debug/vesting-contract-cli      \
--url https://api.devnet.solana.com                             \
--program_id 6v1e8QJUcQZ9AzGND8denhPtJPwhJbGpP4rsUivC4Kqm       \
create                                                          \
--mint_address 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une     \
--source_owner ~/.config/solana/id_owner.json                   \
--source_token_address C7oQjNLggVVttvkutgaivWuPqmYKoFfVSzoFSxxkFJzD                    \
--destination_token_address APVyauiWahV6tPojkStQ7RSTZiJzSLrmGEGAEGRvEpMe                 \
--amounts 2,100,30,!                                               \
--release-times 1,1667642147,1667642247,!                   \
--payer ~/.config/solana/id_owner.json"                         \
--verbose | bash

seed thứ 2: 11111112D1oxKts8YPdTJRG5FzxTNpMtWmq8hkW2S


1000000 = 0.001 NOXAL
1.000.000.000 = 1 NOXAL
10^9 = 1 NOXAL


echo "RUST_BACKTRACE=1 ./target/debug/vesting-contract-cli      \
--url https://api.devnet.solana.com                             \
--program_id 6v1e8QJUcQZ9AzGND8denhPtJPwhJbGpP4rsUivC4Kqm       \
create                                                          \
--mint_address 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une     \
--source_owner ~/.config/solana/id_owner.json                   \
--source_token_address C7oQjNLggVVttvkutgaivWuPqmYKoFfVSzoFSxxkFJzD                    \
--destination_token_address APVyauiWahV6tPojkStQ7RSTZiJzSLrmGEGAEGRvEpMe                 \
--amounts 1000000,2000000,3000000,!                                               \
--release-times 1667642798000,1667643798000,1667653798000,!                   \
--payer ~/.config/solana/id_owner.json"                         \
--verbose | bash

The seed of the contract is: 11111114DhpssPJgSi1YU7hCMfYt1BJ334YgsffcA

echo "RUST_BACKTRACE=1 ./target/debug/vesting-contract-cli      \
--url https://api.devnet.solana.com                             \
--program_id 6v1e8QJUcQZ9AzGND8denhPtJPwhJbGpP4rsUivC4Kqm       \
create                                                          \
--mint_address 2caZBEnWSjxMnDmtMWQVkr8mJTibsXEomRNAtQg98Une     \
--source_owner ~/.config/solana/id_owner.json                   \
--source_token_address C7oQjNLggVVttvkutgaivWuPqmYKoFfVSzoFSxxkFJzD                    \
--destination_token_address APVyauiWahV6tPojkStQ7RSTZiJzSLrmGEGAEGRvEpMe                 \
--amounts 1000000,2000000,3000000,!                                               \
--release-times 1667642798,1667643398,1667653798,!                   \
--payer ~/.config/solana/id_owner.json"                         \
--verbose | bash

The seed of the contract is: 11111114d3RrygbPdAtMuFnDmzsN8T5fYKVQ7FVvV