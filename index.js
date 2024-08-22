import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNum;
    accNumber;
    constructor(fName, lName, age, gender, mobNum, accNumber) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNum = mobNum;
        this.accNumber = accNumber;
    }
} //class
// class bank
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        let newAccounts = this.account.filter((acc) => acc.accNumber != accObj.accNumber);
        this.account = [...newAccounts, accObj];
    }
} // bank class
let WaqasBank = new Bank();
// Create customer
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName('male');
    let lName = faker.person.lastName();
    let mobNum = parseInt(faker.phone.number('3#########'));
    const cus = new Customer(fName, lName, 25 + i, 'male', mobNum, 1000 + i);
    WaqasBank.addCustomer(cus);
    WaqasBank.addAccountNumber({ accNumber: cus.accNumber, balance: 1000 + i });
}
let bankService = async (bank) => {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please select the services!",
            choices: ["View balance", "cash withdraw", "Cash Deposit", "Exit"],
        });
        //View balance
        if (service.select == "View balance") {
            let res = await inquirer.prompt({
                type: 'input',
                name: 'num',
                message: "please enter your account number!",
            });
            let account = bank.account.find((val) => val.accNumber == res.num);
            if (!account) {
                console.log(chalk.reset.bold("Invalid account number"));
            }
            if (account) {
                let name = bank.customer.find((val) => val.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)}
        and your account balance is ${account.balance}`);
            }
        }
        //View cash withdraw
        if (service.select == "cash withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "select",
                message: "Please enter your number!",
            });
            let account = bank.account.find((acc) => acc.accNumber == res?.select);
            if (!account) {
                console.log(chalk.red.bold("Invalid account number!"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: 'ruppee',
                    message: "please enter your amount"
                });
                if (ans.ruppee > account.balance) {
                    console.log(`No amount available`);
                }
                let newBalance = account.balance - ans.ruppee;
                //transition method call
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        //cash deposit
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                type: 'input',
                name: 'acc',
                message: "please Enter your account number",
            });
            let account = bank.account.find((acc) => acc.accNumber == res?.acc);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account!"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: 'number',
                    name: 'ruppee',
                    message: "Please enter your amount!"
                });
                let newBalance = account.balance + ans.ruppee;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        if (service.select === 'Exit') {
            return;
        }
    } while (true);
};
bankService(WaqasBank);
