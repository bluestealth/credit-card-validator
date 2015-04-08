/* 
 * @license Copyright (C) 2015 Michael Dempsey
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Lesser GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/lgpl.html>.
 *
 */

var map = Array.prototype.map,
	creditCardTypes = [
	{
		'cardName': 'visa',
		'codeLengths' : [
			{
				'accountNum' : 16,
				'securityNum': [3]
			}
		],
		'regex' : /^4/,
		'faClass' : 'fa fa-cc-visa'
	},
	{
		'cardName' : 'americanexpress',
		'codeLengths' : [
			{
				'accountNum' : 15,
				'securityNum': [4]
			}
		],
		'regex' : /^3[47]/,
		'faClass' : 'fa fa-cc-amex'
	},
	{
		'cardName' : 'mastercard',
		'codeLengths' : [
			{
				'accountNum' : 16,
				'securityNum': [3]
			}
		],
		'regex' : /^5[1-5]/,
		'faClass' : 'fa fa-cc-mastercard'
	},
	{
		'cardName' : 'discover',
		'codeLengths' : [
			{
				'accountNum' : 16,
				'securityNum': [3]
			}
		],
		'regex' : /^6011|^62212[6-9]|^6221[3-9][0-9]|^622[2-8][0-9][0-9]|^6229[0-1][0-9]|^62292[0-5]|^64[4-9]|^65/,
		'faClass' : 'fa fa-cc-discover'
	},
	{
		'cardName' : 'JCB',
		'codeLengths' : [
			{
				'accountNum' : 16,
				'securityNum': [3]
			}
		],
		'regex' : /^352[89]|^35[3-8][0-9]/,
		'faClass' : 'fa fa-credit-card'
	}
];

var getNumberString = function(string) {
	var matches = string.match(/[0-9]+/g);
	if(!matches)
		return '';
	return matches.join('');
};

Array.prototype.unique = function(arr) {
	var arrOut = [];

	for(var i = 0, arrLen = this.length; i < arrLen; i++) {
		if(arrOut.indexOf(this[i]) < 0)
			arrOut.push(this[i]);
	}

	return arrOut;
};

var luhnCheck = function(numberString) {
	function processDigit(num) {
		num *= 2;
		return num < 10 ? num : num%10 + Math.floor(num/10);
	}

	var intArr = map.call(numberString, function(char) {
		return parseInt(char, 10);
	});

	var arrLen = intArr.length,
	oddOrEven = arrLen % 2,
	checksum = 0,
	index = 0;

	for(; index < arrLen; index++) {
		if(index%2 === oddOrEven)
			checksum += processDigit(intArr[index]);
		else
			checksum += intArr[index];
	}
	return (checksum %10) === 0;
};

exports.getCardName = function(string) {
	var numberString = getNumberString(string);
	var cardName = '';
	for(var type in creditCardTypes) {
		if(creditCardTypes[type].regex.test(numberString)) {
			cardName = creditCardTypes[type].cardName;
			break;
		}
	}
	return cardName;
};

exports.getFaClass = function(string) {
	var numberString = getNumberString(string);
	var faClass = '';
	for(var type in creditCardTypes) {
		if(creditCardTypes[type].regex.test(numberString)) {
			faClass = creditCardTypes[type].faClass;
			break;
		}
	}
	return faClass;
};

exports.getCardAccountNumLengths = function(string) {
	var numberString = getNumberString(string);
	var typeLengths = [-1];
	for(var type in creditCardTypes) {
		if(creditCardTypes[type].regex.test(numberString)) {
			var codeLengths = creditCardTypes[type].codeLengths;
			typeLengths = codeLengths.map( function(elem) {
				return elem.accountNum;
			});
			break;
		}
	}
	return typeLengths;
};

exports.getCardSecurityNumLengths = function(string) {
	var numberString = getNumberString(string);
	var typeLengths = [-1];
	var numLength = numberString.length;

	for(var type in creditCardTypes) {
		if(creditCardTypes[type].regex.test(numberString)) {
			var codeLengths = creditCardTypes[type].codeLengths;
			var allSecurityCodeLengths = [];
			for(var i = 0, arrLen = codeLengths.length; i < arrLen; i++) {
				allSecurityCodeLengths = allSecurityCodeLengths.concat(codeLengths[i].securityNum);
				if(codeLengths[i].accountNum === numLength) {
					typeLengths = codeLengths[i].securityNum;
					break;
				} else if(typeLengths[0] < 0 && i === arrLen-1) {
					typeLengths = allSecurityCodeLengths.unique();
				}
			}
			break;
		}
	}
	return typeLengths;
};

exports.validateCardLength = function(string) {
	var numberString = getNumberString(string);
	var baseTest = /^[0-9]{15,16}$/;

	if(!baseTest.test(numberString))
		return false;

	var numLength  = numberString.length;
	var typeLengths = exports.getCardAccountNumLengths(numberString);

	if(typeLengths[0] < 0 || typeLengths.indexOf(numLength) < 0)
		return false

	return true;
};

exports.validateCardSecurityCodeLength = function(accountString, securityString) {
	var accountNumberString = getNumberString(accountString);
	var securityNumberString = getNumberString(securityString);
	var baseTest = /^[0-9]{3,4}$/;

	if(!baseTest.test(securityString))
		return false;

	var numLength = securityNumberString.length;
	var typeLengths = exports.getCardSecurityNumLengths(accountNumberString);

	if(typeLengths[0] < 0 || typeLengths.indexOf(numLength) < 0)
		return false;

	return true;
};

exports.validateCardLuhn = function(string) {
	var numberString = getNumberString(string);
	return luhnCheck(numberString);
};

exports.validateCard = function(accountString) {
	return	exports.validateCardLength(accountString) &&
		exports.validateCardLuhn(accountString);
};

exports.validateCardAndSecCode = function(accountString, securityString) {
	return	exports.validateCardLength(accountString) &&
		exports.validateCardLuhn(accountString) &&
		exports.validateCardSecurityCodeLength(accountString, securityString);
};
