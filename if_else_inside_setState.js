        setTableData(prev => {
            var newTableData = prev.map(el => {
                let newSum = 0
                if (el.dayIndex == day) {
                    for (let i = 0; i < 24; i++) {
                        let num = el[hourlyColumnNameArray[i]] ? el[hourlyColumnNameArray[i]] : 0
                        if (hourlyColumnNameArray[i] == name) {
                            num = value
                        }
                        newSum += num ? parseFloat(num) : 0 
                    }
                    
                    return {
                        ...el,
                        [name]: value,
                        autoRainSum: newSum ? newSum : 0,
                    }
                } else {
                    return el
                }
            })
                
            return newTableData
        })
