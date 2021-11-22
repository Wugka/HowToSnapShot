//เช็คว่าใช่ลขไหม
export const isNumeric = (str) => {
    if (typeof str == "number") {
        return true
    }
    else if (str == null || typeof str != "string") {
        return false // we only process strings! 
    }
    else {
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

}

//เช็คว่าใช่ integer หรือ emptystring ไหม และ ไม่เกินหลักที่ให้มา 
export const isRegInt = (val, maxLength) => {
    var intReg = new RegExp("^[0-9]{0," + maxLength + "}$");
    var isMatch = intReg.test(val);

    return isMatch;
}

//เช็คว่าใช่ decimal หรือ empty string ไหม, เช็คว่าไม่เกินหลักที่ให้มา ก่อนจุดและหลังจุด
export const isRegDec = (val, intLength, decLength) => {
    var decReg = new RegExp("^([0-9]{0," + intLength + "}?(\\.[0-9]{0," + decLength + "}){0,1})$"); //^([0-9]{0,3}?(\.[0-9]{0,2}){0})$
    var isMatch = decReg.test(val);

    return isMatch;
}
