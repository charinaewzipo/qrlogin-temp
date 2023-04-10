import React,{useEffect, useState} from 'react'
import { useFieldArray } from 'react-hook-form'

// import Input from "./components/input";
import { RHFSelect, RHFTextField } from '@sentry/components/hook-form'
import { Box, Stack, Button, Divider, Typography, InputAdornment, MenuItem } from '@mui/material'
import Iconify from '@sentry/components/iconify'

export default ({ nestIndex, control ,getSubEQU}) => {
    const { fields, remove, append } = useFieldArray({
        control,
        // name: `test[${nestIndex}].nestedArray`,
        name: 'eqtypeperson[0].eqsches[0].eqsubsches'
    })

    const [selectedSubOption, setSelectedSubOption] = useState(null);

    useEffect(() => {
        // console.log('fields หน้าสองได้ค่า =', fields)
        getSubEQU(nestIndex,fields)
    }, [fields])

    const CHECKED_SUB_OPTIONS = [
        { id: 1, name: 'Default' },
        { id: 2, name: 'Uncheck' },
    ]
    
    const UNIT_OPTIONS = [
        { id: 1, name: 'Baht/Hour' },
        { id: 2, name: 'Baht/Sample' },
        { id: 3, name: 'Baht/Booking'},
        { id: 4, name: 'Baht/Times'},
    ]

    const SUB_DETAIL_OPTIONS = [
        { id: 1, name: 'Only one'},
        { id: 2, name: 'At least one' },
    ]

    return (
        <div>
            <div style={{ marginLeft: 10 }}>
                {fields.map((item, k) => {
                    // console.log('item ได้อะไรน้า',item)
                    //   console.log('k ได้อะไรน้า',k)
                    return (
                        <div
                            key={item.id}
                            style={{ height: '50px', marginTop:16}}
                        >
                            <Stack  direction={'row'} spacing={1}>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                                    onClick={() => remove(k)}
                                ></Button>
                                <RHFSelect
                                    name={`eqtypeperson[0].eqsches[0].eqsubsches.eqsubpscheChecked`}
                                    size="small"
                                    label="Checked *"
                                    InputLabelProps={{ shrink: true }}
                                    SelectProps={{
                                        native: false,
                                        sx: { textTransform: 'capitalize' },
                                    }}
                                    sx={{ maxWidth: { md: 160 }, width: '100%' }}
                                >
                                    {/* <MenuItem
                                        value="Fixed"
                                        // onClick={() => handleClearService(index)}
                                        sx={{
                                            mx: 1,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            fontStyle: 'italic',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        Fixed
                                    </MenuItem> */}

                                    <Divider />

                                    {CHECKED_SUB_OPTIONS.map((option) => (
                                        <MenuItem
                                            key={option.id}
                                            value={option.name}
                                            // onClick={() => handleSelectService(index, option.name)}
                                            sx={{
                                                mx: 1,
                                                my: 0.5,
                                                borderRadius: 0.75,
                                                typography: 'body2',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                                <RHFTextField size="small" name={`eqtypeperson[0].eqsches[0].eqsubsches[0].eqsubpscheName`} label="Name *" />
                                <RHFTextField size="small" name={`eqtypeperson[0].eqsches[0].eqsubsches[0].eqsubpscheDescription`} label="Description" />
                                <RHFTextField size="small" name={`eqtypeperson[0].eqsches[0].eqsubsches[0].eqsubpscheUnitPrice.SCIKU_STUDENT_STAFF`} label="Unit price	 *" />
                                <RHFSelect
                                    // name={`item[${item.id}].unit`}
                                    name={'eqtypeperson[0].eqsches[0].eqsubsches.eqsubpscheUnitPer'}
                                    size="small"
                                    label="Unit *"
                                    InputLabelProps={{ shrink: true }}
                                    SelectProps={{
                                        native: false,
                                        sx: { textTransform: 'capitalize' },
                                    }}
                                    sx={{ maxWidth: { md: 160 } }}
                                >
                                    {/* <MenuItem
                                        value="Fixed"
                                        // onClick={() => handleClearService(index)}
                                        sx={{
                                            mx: 1,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            fontStyle: 'italic',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        Fixed
                                    </MenuItem> */}

                                    <Divider />

                                    {UNIT_OPTIONS.map((option) => (
                                        <MenuItem
                                            key={option.id}
                                            value={option.name}
                                            // onClick={() => handleSelectService(index, option.name)}
                                            sx={{
                                                mx: 1,
                                                my: 0.5,
                                                borderRadius: 0.75,
                                                typography: 'body2',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                            </Stack>
                        </div>
                    )
                })}
                    <Stack sx={{mt:2}} justifyContent="flex-end" spacing={1.5} direction={'row'} >
                        <RHFSelect
                            name={`eqtypeperson[0].eqsches[${nestIndex}].eqpscheChecked`}
                            // name={`items[${index}].subDetail`}
                            size="small"
                            label="Sub option type"
                            SelectProps={{
                                native: false,
                                sx: { textTransform: 'capitalize' },
                            }}
                            sx={{ maxWidth: { md: 160 } }}
                            onChange={()=>setSelectedSubOption(true)}
                            placeholder="Sub option type"
                            defaultValue={selectedSubOption}
                            
                        >
                            {/* <MenuItem
                                value="Fixed"
                                // onClick={() => handleClearService(index)}
                                sx={{
                                    mx: 1,
                                    borderRadius: 0.75,
                                    typography: 'body2',
                                    fontStyle: 'italic',
                                    color: 'text.secondary',
                                }}
                            ></MenuItem>

                            <Divider /> */}

                            {SUB_DETAIL_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option.id}
                                    value={option.name}
                                    // onClick={() => handleSelectService(index, option.name)}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {option.name}
                                </MenuItem>
                            ))}
                        </RHFSelect>

                        <Button
                            size="medium"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            onClick={() => append({ field1: 'field1' })}
                            sx={{ flexShrink: 0 }}
                            variant="contained"
                            disabled={selectedSubOption? false : true}
                        >
                            Add Sub detail
                        </Button>
                    </Stack>
            </div>

            <hr />
        </div>
    )
}