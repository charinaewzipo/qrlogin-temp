import { FC, useEffect } from 'react';
import * as Yup from 'yup'
import { LoadingButton } from '@mui/lab'
import { Controller, ErrorOption, useForm } from 'react-hook-form'
import Iconify from '@sentry/components/iconify';
import { yupResolver } from '@hookform/resolvers/yup'
import {
    Alert,
    IconButton,
    InputAdornment,
    Stack,
    Typography,
    TextField,
    Divider,
    CircularProgress,
    FormHelperText,
    Autocomplete,
    Box,
    Paper,
    useTheme,
} from '@mui/material'
import Image from '@sentry/components/image'
import FormProvider, { RHFSelect, RHFTextField } from "@sentry/components/hook-form";
import { Upload, UploadAvatar } from '@sentry/components/upload';
import { fData } from '@sentry/utils/formatNumber';
import { clamp, every, get } from 'lodash';
import { DatePicker } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from '@ku/redux';
import { clearSupervisor, getSupervisor } from '@ku/redux/supervisor';

type FormValuesProps = {
    afterSubmit?: string
    privillege: string
    email: string
    password: string
    accountStatus: string
    accountExpiryDate: string
    typeOfPerson: string
    avatar: string
    department: string
    governmentName: string
    companyName: string
    position: string
    studentId: string
    staffId: string
    positionName: string
    expiryDate: string
    title: string
    otherTitle: string
    firstName: string
    surName: string
    address: string
    phoneNumber: string
    idImages: string[]
    creditLimit: string
    bookingLimit: string
    supervisorCode: string
}
const constant = {
    createAccount: 'Create Account',
    cancel: 'Cancel',
    privillege: 'Privillege *',
    accountStatus: 'Account Status *',
    accountExpiryDate: 'Account expiry date',
    email: 'Email *',
    password: 'Password',
    passwordPlaceholder: '********** (Auto Generated)',
    typeOfPerson: 'Type of person *',
    department: 'Department *',
    governmentName: 'Government name *',
    universityName: 'University name *',
    companyName: 'Company name *',
    position: 'Position *',
    studentId: 'StudentId *',
    staffId: 'Staff ID',
    positionName: 'Position name *',
    expiryDate: 'Expiry date *',
    title: 'Title *',
    otherTitle: 'Other title',
    firstName: 'Firstname *',
    surName: 'Surname *',
    address: 'Address *',
    phoneNumber: 'Phone number *',
    studentIdImage: 'Student/Staff ID Image',
    citizenIdImage: 'Citizen ID Image',
    creditLimit: 'Credit limit *',
    bookingLimit: 'Booking limit *',
    supervisorDetail: 'Supervisor/Advisor Detail',
    enterSupervisorCode: 'Please enter the code form supervisor associated with your account here.',
    supervisorCode: 'Supervisor code',
    supervisorNotFound: 'Supervisor code not found, please contact your supervisor for code',
}
const typeOfPerson = [
    {value: 'SciKU Student & Staff', label: 'SciKU Student & Staff'},
    {value: 'KU Student & Staff', label: 'KU Student & Staff'},
    {value: 'Other University', label: 'Other University'},
    {value: 'Government office', label: 'Government office'},
    {value: 'Private company', label: 'Private company'},
]
const position = [
    {value: 'Lecturer', label: 'Lecturer'},
    {value: 'Researcher', label: 'Researcher'},
    {value: 'Ph.D. student', label: 'Ph.D. student'},
    {value: 'Master student', label: 'Master student'},
    {value: 'Bachelor student', label: 'Bachelor student'},
    {value: 'Other', label: 'Other'},
]
const department = [
    {value: 'Dept. of Applied Radiation and Isotope', label: 'Dept. of Applied Radiation and Isotope'},
    {value: 'Dept. of Biochemistry', label: 'Dept. of Biochemistry'},
    {value: 'Dept. of Botany', label: 'Dept. of Botany'},
    {value: 'Dept. of Chemistry', label: 'Dept. of Chemistry'},
    {value: 'Dept. of Computer Science', label: 'Dept. of Computer Science'},
    {value: 'Dept. of Earth Sciences', label: 'Dept. of Earth Sciences'},
    {value: 'Dept. of Genetics', label: 'Dept. of Genetics'},
    {value: 'Dept. of Material Science', label: 'Dept. of Material Science'},
    {value: 'Dept. of Mathematics', label: 'Dept. of Mathematics'},
    {value: 'Dept. of Microbiology', label: 'Dept. of Microbiology'},
    {value: 'Dept. of Physics', label: 'Dept. of Physics'},
    {value: 'Dept. of Statustics', label: 'Dept. of Statustics'},
    {value: 'Dept. of Zoology', label: 'Dept. of Zoology'},
]
const title = [
    {value: 'Mr', label: 'Mr'},
    {value: 'Miss', label: 'Miss'},
    {value: 'Mrs', label: 'Mrs'},
    {value: 'Ms', label: 'Ms'},
    {value: 'Dr', label: 'Dr'},
    {value: 'Asst.Prof', label: 'Asst.Prof'},
    {value: 'Assoc.Prof', label: 'Assoc.Prof'},
    {value: 'Prof', label: 'Prof'},
    {value: 'Other', label: 'Other'},
]
const accountStatus = [
    {value: 'Active', label: 'Active'},
    {value: 'Inactive', label: 'Inactive'},
    {value: 'Lock', label: 'Lock'},
]
const privillege = [
    {value: 'User', label: 'User'},
]
interface AccountFormProps {
    onSubmit: () => void
    onCancel: () => void
}
interface IIdImageUpload {
  index: number
}
function AccountForm(props: AccountFormProps) {
    const checkIsKuPerson = (typeOfPerson: string) =>
        ['KU Student & Staff', 'SciKU Student & Staff'].includes(typeOfPerson)
    const checkIsStudent = (position: string) => position.includes('student')
    const checkIsStaff = (position: string) => ['Lecturer', 'Researcher',].includes(position)
    const checkIsKuStudent = (position: string, typeOfPerson: string) =>
        checkIsKuPerson(typeOfPerson) && checkIsStudent(position)

    const RegisterSchema = Yup.object().shape({
        privillege: Yup.string().required('Privillege is require'),
        email: Yup.string()
            .email('Email must be a valid email address')
            .required('Email is required'),
        password: Yup.string(),
        accountStatus: Yup.string().required('Account Status is require'),
        accountExpiryDate: Yup.string(),
        avatar: Yup.string().required('Profile image is require'),
        typeOfPerson: Yup.string().required('Type of person is require'),
        department: Yup.string().nullable().when('typeOfPerson', {
            is: (position) => checkIsKuPerson(position) || position === '',
            then: Yup.string().nullable().required('Department is require'),
        }),
        universityName: Yup.string().when('typeOfPerson', {
            is: 'Other University',
            then: Yup.string().required('University name is require'),
        }),
        governmentName: Yup.string().when('typeOfPerson', {
            is: 'Government office',
            then: Yup.string().required('Government name is require'),
        }),
        companyName: Yup.string().when('typeOfPerson', {
            is: 'Private company',
            then: Yup.string().required('Company name is require'),
        }),
        position: Yup.string().required('Position is require'),
        studentId: Yup.string().when(['position', 'typeOfPerson'], {
            is: (position, typeOfPerson) => checkIsKuStudent(position, typeOfPerson),
            then: Yup.string().required('Student ID is required'),
        }),
        staffId: Yup.string(),
        positionName: Yup.string().when('position', {
            is: 'Other',
            then: Yup.string().required('Position is require'),
        }),
        expiryDate: Yup.string().when(['position', 'typeOfPerson'], {
            is: (position, typeOfPerson) => checkIsKuStudent(position, typeOfPerson),
            then: Yup.string().required('Expiry date is required'),
        }),
        title: Yup.string().required('Title is require'),
        otherTitle: Yup.string().when('title', {
            is: (title) => title === 'Other' || title === '',
            then: Yup.string().required('Other title is require'),
        }),
        firstName: Yup.string().required('Firstname is require'),
        surName: Yup.string().required('Surname is require'),
        address: Yup.string().required('Address is require'),
        phoneNumber: Yup.string().required('Phone number is require'),
        idImages: Yup.array(Yup.string()).when(['position', 'typeOfPerson'], {
            is: (position, typeOfPerson) => checkIsKuStudent(position, typeOfPerson),
            then: Yup.array(Yup.string()).test({
                name: 'idImages',
                message: 'SciKU student & staff ID card are require',
                test: (idImages) => every(idImages, (img) => img !== ''),
            }),
        }),
        creditLimit: Yup.string().required('Credit limit is require'),
        bookingLimit: Yup.string().required('Booking limit is require'),
        supervisorCode: Yup.string().when(['position', 'typeOfPerson'], {
            is: (position, typeOfPerson) => checkIsKuStudent(position, typeOfPerson),
            then: Yup.string().required('Supervisor code is require, please contact your supervisor for code'),
        }),
    })

    const defaultValues = {
        privillege: privillege[0].value,
        avatar: '',
        email: '',
        password: '',
        accountStatus: accountStatus[0].value,
        accountExpiryDate: '',
        typeOfPerson: '',
        department: '',
        universityName: '',
        studentId: '',
        position: '',
        staffId: '',
        positionName: '',
        expiryDate: '',
        title: '',
        otherTitle: '',
        firstName: '',
        surName: '',
        address: '',
        phoneNumber: '',
        idImages: [''],
        creditLimit: '',
        bookingLimit: '',
        supervisorCode: '',
    }

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    })

    const {
        setError,
        clearErrors,
        handleSubmit,
        getValues,
        formState: { errors },
        control,
        watch,
    } = methods

    const watchTypeOfPerson = watch('typeOfPerson')
    const watchPosition = watch('position')
    const watchTitle = watch('title')
    const watchSupervisorCode = watch('supervisorCode')
    useEffect(() => {
        fetchSupervisorData(watchSupervisorCode)
    }, [watchSupervisorCode])
    
    const isKu = checkIsKuPerson(watchTypeOfPerson)
    const isStudent = checkIsStudent(watchPosition)
    const isStaff = checkIsStaff(watchPosition)
    const isKuStudent = checkIsKuStudent(watchPosition, watchTypeOfPerson)
    const isPositionOther = watchPosition === 'Other'
    const isTitleOther = watchTitle === 'Other' || watchTitle === ''

    useEffect(() => {
        return () => {
            dispatch(clearSupervisor())
        }
    }, [])

    const dispatch = useDispatch()
    const supervisorSelector = useSelector(state => state.supervisor)
    useEffect(() => {
        if (supervisorSelector.isLoading)
            return
        if (supervisorSelector.supervisor.code === '500') {
            setError('supervisorCode', {type: 'custom', message: constant.supervisorNotFound})
        } else {
            clearErrors('supervisorCode')
        }
    }, [supervisorSelector.isLoading])

    const fetchSupervisorData = (code: string) => {
        setError('supervisorCode', {type: 'custom', message: ''})
        if (!code)
            return
        if (code.length < 6)
            return
        dispatch(getSupervisor(code))
    }

    const onSubmit = async (data: FormValuesProps) => {
        methods.watch
        const errorOptions: ErrorOption = {
            message: "errorResponse.data || errorResponse.devMessage"
        }
        setError('afterSubmit', errorOptions)
        console.log(data);
        window.scrollTo(0, 0)
    }

    const IdImageUpload: FC<IIdImageUpload> = ({ index }) => {
        return (
            <Controller
                name={`idImages.${index}`}
                control={control}
                render={({ field }) => (
                    <Upload
                        dropzoneHelper={
                            <Box sx={{ py: 3, px: 1 }}>
                                <Typography gutterBottom variant="h5" sx={{ ml: -2 }}>
                                    {isKu || watchTypeOfPerson === ''
                                        ? constant.studentIdImage
                                        : constant.citizenIdImage}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    component="p"
                                    whiteSpace="pre-line"
                                    sx={{ ml: -2 }}
                                >
                                    Drop files here or click
                                    <Typography
                                        variant="body2"
                                        component="span"
                                        sx={{
                                            mx: 0.5,
                                            color: 'primary.main',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {`browse\n`}
                                    </Typography>
                                    {`thorough your machine.\n\n`}
                                    {`Allowed *.jpeg, *.jpg, *.png\n`}
                                    {`Max size of 200KB`}
                                </Typography>
                            </Box>
                        }
                        accept={{ 'image/*': ['.jpeg, .jpg, .png, .gif'] }}
                        file={field.value}
                        onDrop={(files) => field.onChange(URL.createObjectURL(files[0]))}
                        onDelete={() => field.onChange('')}
                        sx={{
                            width: get(field, 'value', '') === '' ? 264 : '100%',
                            flex: get(field, 'value', '') === '' ? '' : '50%',
                            '& > div > div': {
                                flexDirection: 'column',
                                textAlign: 'center',
                            },
                        }}
                        maxSize={200000}
                    />
                )}
            />
        )
    }
    const RenderIdImageUpload = () => {
        const idImageWithoutEmpty = watch('idImages').filter(idImage => idImage)
        const idImageLength = clamp(idImageWithoutEmpty.length + 1, 1, 2)
        return (
            <>
                <Stack flexDirection={'row'} flexWrap={'wrap'} gap={1.5}>
                    {[...Array(idImageLength).keys()].map((i) => (
                        <IdImageUpload key={`id-image-upload-${i}`} index={i} />
                    ))}
                </Stack>
                {errors.idImages?.message ? (
                    <FormHelperText error sx={{ textAlign: 'center ' }}>
                        {errors.idImages?.message}
                    </FormHelperText>
                ) : (
                    <></>
                )}
            </>
        )
    }

    const collapseableInputStyle = (isShow: boolean) => ({
        flex: isShow ? '100%' : '0%',
        transform: `scaleZ(${isShow ? '1' : '0'})`,
        transitionDuration: '.2s',
        transformOrigin: 'right',
        marginLeft: isShow ? 3 : -3,
        '& > div': {
            transitionDuration: '.2s',
            opacity: isShow ? 1 : 0,
        },
    })
    
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
                {!!errors.afterSubmit && (
                    <Alert severity="error">{errors.afterSubmit.message}</Alert>
                )}
                <Paper elevation={3} sx={{ borderRadius: 2, p: 3 }}>
                    <Stack spacing={3}>
                        <RHFSelect
                            name="privillege"
                            label={constant.privillege}
                            placeholder={constant.privillege}
                            InputLabelProps={{ shrink: true }}
                        >
                            {privillege.map(({ value, label }) => (
                                <option value={value} key={`${value}-privillege-option`}>
                                    {label}
                                </option>
                            ))}
                        </RHFSelect>
                        <RHFTextField name="email" label={constant.email} />
                        <RHFTextField
                            name="password"
                            label={constant.password}
                            placeholder={constant.passwordPlaceholder}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Stack gap={3} flexDirection="row">
                            <RHFSelect
                                name="accountStatus"
                                label={constant.accountStatus}
                                placeholder={constant.accountStatus}
                                InputLabelProps={{ shrink: true }}
                            >
                                {accountStatus.map(({ value, label }) => (
                                    <option value={value} key={`${value}-accountStatus-option`}>
                                        {label}
                                    </option>
                                ))}
                            </RHFSelect>
                            <Controller
                                name="accountExpiryDate"
                                control={control}
                                defaultValue={''}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        inputFormat="dd MMM yyyy"
                                        label={constant.accountExpiryDate}
                                        value={field.value || null}
                                        onChange={(newValue) => {
                                            field.onChange(newValue)
                                        }}
                                        disableMaskedInput
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!error}
                                                helperText={error?.message}
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Stack>
                    </Stack>
                </Paper>
                <Paper elevation={8} sx={{ borderRadius: 2, p: 3 }}>
                    <Stack spacing={3} justifyContent="center" textAlign={'center'}>
                        <Controller
                            name="avatar"
                            control={control}
                            render={({ field }) => (
                                <Stack sx={{ mt: 1 }}>
                                    <UploadAvatar
                                        accept={{ 'image/*': ['.jpeg, .jpg, .png, .gif'] }}
                                        file={field.value}
                                        onDrop={(files) =>
                                            field.onChange(URL.createObjectURL(files[0]))
                                        }
                                        maxSize={200000}
                                        helperText={
                                            <Typography
                                                variant="caption"
                                                sx={{ mt: 1, color: 'text.secondary' }}
                                            >
                                                Allowed *.jpeg, *.jpg, *.png, *.gif
                                                <br /> max size of {fData(200000)}
                                            </Typography>
                                        }
                                    />
                                    <FormHelperText error sx={{ mt: 2, textAlign: 'center' }}>
                                        {errors.avatar?.message}
                                    </FormHelperText>
                                </Stack>
                            )}
                        />
                        <Stack flexDirection={'row'} gap={3}>
                            <RHFSelect
                                name="typeOfPerson"
                                label={constant.typeOfPerson}
                                placeholder={constant.typeOfPerson}
                            >
                                <option
                                    value={''}
                                    key={`${''}-typeOfPerson-option`}
                                    hidden
                                ></option>
                                {typeOfPerson.map(({ value, label }) => (
                                    <option value={value} key={`${value}-typeOfPerson-option`}>
                                        {label}
                                    </option>
                                ))}
                            </RHFSelect>
                            {{
                                'Other University': (
                                    <RHFTextField
                                        name="universityName"
                                        label={constant.universityName}
                                    />
                                ),
                                'KU Student & Staff': (
                                    <RHFTextField
                                        name="department"
                                        key={'department-textfield'}
                                        label={constant.department}
                                    />
                                ),
                                'SciKU Student & Staff': (
                                    <Controller
                                        name="department"
                                        control={control}
                                        render={({ field }) => (
                                            <Autocomplete
                                                {...field}
                                                freeSolo
                                                fullWidth
                                                onChange={(event, newValue) =>
                                                    field.onChange(get(newValue, 'value', newValue))
                                                }
                                                options={department}
                                                key={'department-auto'}
                                                renderInput={(param) => (
                                                    <TextField
                                                        {...param}
                                                        error={!!errors?.department}
                                                        helperText={get(
                                                            errors?.department,
                                                            'message',
                                                            ''
                                                        )}
                                                        label={constant.department}
                                                    />
                                                )}
                                                placeholder={constant.department}
                                            />
                                        )}
                                    />
                                ),
                                'Government office': (
                                    <RHFTextField
                                        name="governmentName"
                                        key={'governmentName-textfield'}
                                        label={constant.governmentName}
                                    />
                                ),
                                'Private company': (
                                    <RHFTextField
                                        name="companyName"
                                        key={'companyName-textfield'}
                                        label={constant.companyName}
                                    />
                                ),
                            }[watchTypeOfPerson] || (
                                <RHFTextField
                                    name="department"
                                    key={'department-textfield'}
                                    label={constant.department}
                                />
                            )}
                        </Stack>
                        <Stack flexDirection={'row'}>
                            <RHFSelect
                                name="position"
                                label={constant.position}
                                placeholder={constant.position}
                                sx={{ flex: '100%' }}
                            >
                                <option value={''} key={`${''}-position-option`} hidden></option>
                                {position.map(({ value, label }) => {
                                    if (
                                        watchTypeOfPerson === 'SciKU Student & Staff' &&
                                        value === 'Other'
                                    )
                                        return
                                    return (
                                        <option value={value} key={`${value}-position-option`}>
                                            {label}
                                        </option>
                                    )
                                })}
                            </RHFSelect>

                            <Stack
                                sx={collapseableInputStyle(
                                    (isKu || isPositionOther) && watchPosition !== ''
                                )}
                            >
                                {isKuStudent ? (
                                    <RHFTextField name="studentId" label={constant.studentId} />
                                ) : isKu && isStaff ? (
                                    <RHFTextField name="staffId" label={constant.staffId} />
                                ) : isPositionOther ? (
                                    <RHFTextField
                                        name="positionName"
                                        label={constant.positionName}
                                    />
                                ) : (
                                    <RHFTextField name="studentId" label={constant.studentId} />
                                )}
                            </Stack>
                        </Stack>

                        {isKu && isStudent ? (
                            <Controller
                                name="expiryDate"
                                control={control}
                                defaultValue={''}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        inputFormat="dd MMM yyyy"
                                        label={constant.expiryDate}
                                        value={field.value || null}
                                        onChange={(newValue) => {
                                            field.onChange(newValue)
                                        }}
                                        disableMaskedInput
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                )}
                            />
                        ) : (
                            <></>
                        )}
                        <Stack flexDirection={'row'} gap={3}>
                            <RHFSelect
                                name="title"
                                label={constant.title}
                                placeholder={constant.title}
                                // onBlur={() => clearErrors('otherTitle')}
                            >
                                <option value={''} key={`${''}-title-option`} hidden></option>
                                {title.map(({ value, label }) => (
                                    <option value={value} key={`${value}-title-option`}>
                                        {label}
                                    </option>
                                ))}
                            </RHFSelect>
                            <RHFTextField
                                name={isTitleOther ? 'otherTitle' : ''}
                                label={`${constant.otherTitle} ${isTitleOther ? '*' : ''}`}
                                disabled={!isTitleOther}
                            />
                            <RHFTextField name="firstName" label={constant.firstName} />
                            <RHFTextField
                                name="surName"
                                label={constant.surName}
                            />
                        </Stack>
                        <RHFTextField
                            name="address"
                            multiline
                            label={constant.address}
                            minRows={4}
                        />
                        <RHFTextField name="phoneNumber" label={constant.phoneNumber} />
                        <Stack flexDirection={'row'} gap={3}>
                            <RHFTextField name="creditLimit" label={constant.creditLimit} />
                            <RHFTextField name="bookingLimit" label={constant.bookingLimit} />
                        </Stack>
                        <RenderIdImageUpload />
                    </Stack>
                </Paper>
                {isKu && isStudent ? (
                    <Paper elevation={8} sx={{ borderRadius: 2, p: 3 }}>
                        <Stack spacing={2} textAlign={'left'}>
                            <Typography variant="h4">{constant.supervisorDetail}</Typography>
                            <Typography variant="body1" whiteSpace={'pre-line'}>
                                {constant.enterSupervisorCode}
                            </Typography>
                            <RHFTextField
                                name="supervisorCode"
                                defaultValue=""
                                label={constant.supervisorCode}
                                error={!!errors.supervisorCode}
                                helperText={get(errors?.supervisorCode, 'message', '')}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {supervisorSelector.isLoading ? (
                                                <CircularProgress
                                                    size={16}
                                                    sx={{ color: 'text.primary' }}
                                                />
                                            ) : !!errors.supervisorCode ? (
                                                <IconButton
                                                    onClick={() =>
                                                        fetchSupervisorData(
                                                            getValues('supervisorCode')
                                                        )
                                                    }
                                                    edge="end"
                                                >
                                                    <Iconify icon={'ic:round-refresh'} />
                                                </IconButton>
                                            ) : (
                                                <></>
                                            )}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {!supervisorSelector.isLoading &&
                            supervisorSelector.supervisor.code === '200' ? (
                                <Stack flexDirection={'row'} gap={4} alignItems={'center'}>
                                    <Image
                                        alt="Logo"
                                        src={supervisorSelector.supervisor.pic}
                                        sx={{ height: 64, width: 64, borderRadius: 1 }}
                                        disabledEffect
                                    />
                                    <Stack>
                                        <Typography variant="h6">
                                            {`${supervisorSelector.supervisor.name} (${supervisorSelector.supervisor.code})`}
                                        </Typography>
                                        <Typography variant="body1" whiteSpace={'pre-line'}>
                                            {supervisorSelector.supervisor.email}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            ) : (
                                <></>
                            )}
                        </Stack>
                    </Paper>
                ) : (
                    <></>
                )}
                <Stack flexDirection='row' justifyContent='right' gap={2}>
                    <LoadingButton
                        type="button"
                        variant="contained"
                        size='large'
                        onClick={props.onCancel}
                        color='inherit'
                    >
                        {constant.cancel}
                    </LoadingButton>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        size='large'
                        onClick={props.onSubmit}
                        // loading={authenticationStore.isFetching}
                    >
                        {constant.createAccount}
                    </LoadingButton>
                </Stack>
            </Stack>
        </FormProvider>
    )
}

export default AccountForm