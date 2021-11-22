                                <Input
                                    id="postalcode"
                                    type='text'
                                    onChange={e => { e.persist(); isRegInt(e.target.value,5) ? setPersonInputData(prev => ({ ...prev, postalCode: e.target.value })) : e.preventDefault() }}
                                    value={personInputData.postalCode}
                                />
