import styles from '../../styles/index.module.scss'
import Head from 'next/head'
import { Box, Container } from '@mui/material'
import AuthorizedLayout from '@ku/layouts/authorized'
import CustomBreadcrumbs from '@sentry/components/custom-breadcrumbs'
// import { useTranslation } from "next-i18next";
import  { IEquipmentCreateFormValuesProps } from '@ku/components/Equipment/EquipmentCreateForm'
import EquipmentCreateForm from '@ku/components/Equipment/EquipmentCreateForm'
import { useSnackbar } from '@sentry/components/snackbar'
import { useRouter } from 'next/router'
import { ACCOUNT_PATH } from '@ku/constants/routes'
import { useState } from 'react'

EquipmentCreate.getLayout = (page: React.ReactElement) => <AuthorizedLayout> {page} </AuthorizedLayout>
declare type PERMISSION = 'Admin' | 'Finance' | 'Supervisor' | 'User'

export function EquipmentCreate() {
    // const { t } = useTranslation();
    const permission : PERMISSION = 'Admin'
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter()
    const [errorMsg, setErrorMsg] = useState('')

    const onFormSubmit = (data: IEquipmentCreateFormValuesProps) => {
        //TODO: api submit
        enqueueSnackbar('Account create success.')
        // setErrorMsg('error msg')
        console.log('submit', data)
    }

    const onFormCancel = () => {
        router.push(ACCOUNT_PATH)
    }

    return (
        <>
            <Head>
                <title>Equipments Create | KU</title>
            </Head>
            <Container>
                <Box
                    sx={{
                        overflow: 'visible',
                        position: 'relative',
                        bgcolor: 'background.default',
                    }}
                >
                    <div className={styles.page}>
                        <div className="wrapper">
                            <CustomBreadcrumbs
                                heading="Equipments"
                                links={[
                                    { name: 'Equipments', href: '/equipment' },
                                    { name: 'List', href: '/equipment' },
                                    { name: 'New equipment' },
                                ]}
                                sx={{ mt: 3, mb: 5, height: 72 }}
                            />
                              <EquipmentCreateForm onSubmit={onFormSubmit} onCancel={onFormCancel} errorMsg={errorMsg} />
                        </div>
                    </div>
                </Box>
            </Container>
        </>
    )
}

export default EquipmentCreate