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

//************************************************************************************************************

        props.setTampDatagageheight(prev => (
             prev.map(el => el.idx == props.dataRemarkModal.idx ?
                {
                    ...el,
                     list: el.list.map(el2 => {
                         if (el2.key == props.dataRemarkModal.id) {
                             var timeString = el2.key != null ? moment(el2.key).format('hh:mm') : null
                             return {
                                 ...el2,
                                 remarkid: dataRemark.selected.value,
                                 remarkdesc: valuedesc,
                                 dataremarkdesc: valueselected,
                                 datestring: timeString
                             }
                         } else {
                             return el2
                         }
                     })
                 }
             : el))
        )
