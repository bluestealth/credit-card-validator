# credit-card-validator

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Process Visa, American Express, Discover, Mastercard, and JCB Credit Card Numbers

## Installation

```sh
$ npm install credit-card-validator
```

## API

```js
var creditCardValidator = require('credit-card-validator')

```

### creditCardValidator.getCardName(accountString)

Processes a string containing a partial or full credit card number and returns the card type.

### creditCardValidator.getFaClass(accountString)

Processes a string contaning a partial or full credit card number and returns the font-awesome class related to the given card.

### creditCardValidator.getCardAccountNumLengths(accountString)

Processes a string containing a partial or full credit card number and returns the accepted account number lengths for a given card type.

### creditCardValidator.getCardSecurityNumLengths(accountString)

Processes a string containing a partial or full credit card number and returns the accepted security number lengths for a given card type.

### creditCardValidator.validateCardLength(accountString)

Processes a string containing a full credit card number and returns true if the length of the account number given is acceptable for a given type of card.

### creditCardValidator.validateCardSecurityCodeLength(accountString, securityString)

Processes a string containing a partial or full credit card number along with a security code and returns true if the length of the security code is acceptable for a given type of card.

### creditCardValidator.validateCardLuhn(accountString)

Processes a string containing a credit card number and returns true if the luhn checksum is correct.

### creditCardValidator.validateCard(accountString)

Processes a string containing a full credit card number and returns true if the card number is the right length for the card type and it has a valid luhn checksum.

### creditCardValidator.validateCardAndSecCode(accountString, securityString)

Processes a string containing a full credit card number and returns true if the account number and security code are the correct length for the card type and it has a valid luhn checksum.

## Example

```js
var creditCardValidator = require('credit-card-validator');
var validCard = creditCardValidator.validateCardAndSecCode('4111 1111 1111 1111', '412');
```

### [LGPLv3+](LICENSE)

[npm-image]: https://img.shields.io/npm/v/credit-card-validator.svg
[npm-url]: https://npmjs.org/package/credit-card-validator
[downloads-url]: https://npmjs.org/package/credit-card-validator
[downloads-image]: https://img.shields.io/npm/dm/credit-card-validator.svg
