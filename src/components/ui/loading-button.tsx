import MuiButton, { ButtonProps } from '@mui/material/Button'
import MuiCircularProgress from '@mui/material/CircularProgress'

interface Props extends ButtonProps {
	isLoading?: boolean
}

export const LoadingButton = ({ isLoading, children, ...props }: Props) => {
	return (
		<MuiButton sx={{ overflow: 'hidden' }} {...props}>
			{isLoading ? <MuiCircularProgress color='inherit' size={24} /> : children}
		</MuiButton>
	)
}
