import {
  HamburgerIcon,
  QuestionIcon,
  ChevronRightIcon,
  ExternalLinkIcon
} from '@chakra-ui/icons'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Tooltip,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Mark,
  Switch,
  Text
} from '@chakra-ui/react'
import { Formik, Form, Field, FormikConfig, FieldProps } from 'formik'
import { useEffect, useState } from 'react'
import { STORAGEKEY } from '@const/storage'
import { getItem, setItem } from '@/utils/storage'

export type Setting = {
  token?: string
  useTrending?: boolean
}

const initialSetting = { token: '', useTrending: true }

const SettingPanel = () => {
  const [setting, setSetting] = useState<Setting>(initialSetting)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    handleGetSetting()
  }, [])

  const handleGetSetting = () => {
    const prevSetting = getItem<Setting>(STORAGEKEY, initialSetting)

    setSetting(prevSetting as Setting)
  }

  const handleSubmit: FormikConfig<Setting>['onSubmit'] = (
    values,
    { setSubmitting }
  ) => {
    setItem(STORAGEKEY, values)
    setSetting(values)
    setSubmitting(false)
    onClose()
    toast({
      status: 'success',
      title: '偏好设置成功!'
    })
  }

  return (
    <>
      <Tooltip isOpen={!isOpen} closeOnClick hasArrow label="设置Token">
        <Button onClick={onOpen} variant="ghost">
          <HamburgerIcon fontSize="24" />
        </Button>
      </Tooltip>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent minW={{ base: 'full', md: 'min-content' }}>
          <DrawerCloseButton />
          <DrawerHeader>偏好设置</DrawerHeader>
          <DrawerBody>
            <Formik<Setting> initialValues={setting} onSubmit={handleSubmit}>
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    name="token"
                    validate={(value: string) => {
                      if (!value) return 'Token is Required'
                    }}
                  >
                    {({
                      field,
                      meta: { error, touched }
                    }: FieldProps<string, Setting>) => (
                      <FormControl isRequired isInvalid={!!(error && touched)}>
                        <FormLabel display="flex" alignItems="center">
                          token
                          <Tooltip
                            label="Generate a token and add it below to avoid hitting the
                          rate limit."
                          >
                            <QuestionIcon ml="1" />
                          </Tooltip>
                        </FormLabel>
                        <Input {...field} placeholder="github access token" />
                        {error && touched && (
                          <FormErrorMessage>{error}</FormErrorMessage>
                        )}
                        <FormHelperText>
                          <Link
                            isExternal
                            href="https://github.com/settings/tokens/new?description=GitHunt&scopes=public_repo"
                            display="flex"
                            alignItems="center"
                            px="2"
                            py="2"
                          >
                            <ExternalLinkIcon mr="2" />
                            <Breadcrumb
                              spacing="0.5"
                              separator={<ChevronRightIcon />}
                              minW="max-content"
                            >
                              <BreadcrumbItem>
                                <BreadcrumbLink as="b">
                                  <Mark
                                    bg="purple.300"
                                    color="white"
                                    borderRadius="lg"
                                    p="1"
                                  >
                                    Settings
                                  </Mark>
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbItem>
                                <BreadcrumbLink as="b">
                                  <Mark
                                    bg="purple.300"
                                    color="white"
                                    borderRadius="lg"
                                    p="1"
                                  >
                                    Personal Access Tokens
                                  </Mark>
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbItem>
                                <BreadcrumbLink as="b">
                                  <Mark
                                    bg="purple.300"
                                    color="white"
                                    borderRadius="lg"
                                    p="1"
                                  >
                                    Generate new Token
                                  </Mark>
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                            </Breadcrumb>
                          </Link>
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="useTrending">
                    {({
                      field: { value, ...restField }
                    }: FieldProps<boolean, Setting>) => (
                      <FormControl mt="4">
                        <FormLabel>useTrending</FormLabel>
                        <Switch {...restField} isChecked={value} size="md" />
                        <FormHelperText>
                          若开启
                          <Mark
                            bg="purple.300"
                            color="white"
                            borderRadius="lg"
                            p="1"
                            mx="2"
                          >
                            Trending
                          </Mark>
                          则会使用对应
                          <Text as="b" mx="2">
                            API
                          </Text>
                          达到一样的数据. 关闭则使用
                          <Text as="b" mx="2">
                            search/repositories
                          </Text>
                          进行数据抓取
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    mt="8"
                    type="submit"
                    isLoading={isSubmitting}
                    width="full"
                  >
                    保存
                  </Button>
                </Form>
              )}
            </Formik>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

SettingPanel.displayName = 'SettingPanel'

export default SettingPanel
