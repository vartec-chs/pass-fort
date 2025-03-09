import { type FC, useState } from 'react'

import {
	Box,
	Button,
	FormControlLabel,
	FormGroup,
	Grid2,
	IconButton,
	Input,
	InputAdornment,
	LinearProgress,
	Slider,
	Stack,
	Switch,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'

import { Copy } from 'lucide-react'

import { PasswordControllersForm } from './password-controllers.form'

interface PasswordGeneratorFormProps {
	onPasswordGenerate: (password: string) => void
}

// !";#$%&'()*+,-./:;<=>?@[]^_`{|}~

export const PasswordGeneratorForm: FC<PasswordGeneratorFormProps> = ({ onPasswordGenerate }) => {
	const [value, setValue] = useState(8)

	const handleSliderChange = (event: Event, newValue: number | number[]) => {
		setValue(newValue as number)
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value === '' ? 0 : Number(event.target.value))
	}

	const handleBlur = () => {
		if (value < 1) {
			setValue(1)
		} else if (value > 128) {
			setValue(128)
		}
	}
	return (
		<Stack width={'100%'} height={'100%'} component='form' gap={2} position={'relative'}>
			<TextField
				slotProps={{
					input: {
						readOnly: true,
						endAdornment: (
							<InputAdornment position='end'>
								<Tooltip title='Скопировать'>
									<IconButton>
										<Copy size={18} />
									</IconButton>
								</Tooltip>
							</InputAdornment>
						),
					},
				}}
				variant='standard'
				label='Пароль'
			/>

			<Stack>
				<LinearProgress variant='determinate' value={80} />
				<Typography variant='body2' color='textSecondary'>
					80% of password complexity
				</Typography>
			</Stack>

			<Box sx={{ width: '100%' }}>
				<Grid2 container spacing={1} sx={{ alignItems: 'center' }}>
					<Grid2 size={8}>
						<Slider
							value={typeof value === 'number' ? value : 1}
							onChange={handleSliderChange}
							min={1}
							max={128}
							aria-labelledby='input-slider'
						/>
					</Grid2>
					<Grid2 size={4}>
						<Input
							value={value}
							size='small'
							onChange={handleInputChange}
							onBlur={handleBlur}
							inputProps={{
								step: 1,
								min: 1,
								max: 128,
								type: 'number',
								'aria-labelledby': 'input-slider',
							}}
						/>
					</Grid2>
				</Grid2>
			</Box>

			<PasswordControllersForm onChange={(value) => console.log(value)} />

			<Button
				sx={{
					position: 'absolute',
					bottom: 0,
				}}
				fullWidth
				variant='contained'
				size='large'
				color='primary'
				onClick={() => onPasswordGenerate('')}
			>
				Сгенерировать
			</Button>
		</Stack>
	)
}
