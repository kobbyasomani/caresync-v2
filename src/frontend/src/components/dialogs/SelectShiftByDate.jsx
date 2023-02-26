import { Stack } from "@mui/material";
import Shift from "../Shift";
import { ButtonPrimary } from "../root/Buttons";
import MoreTimeIcon from '@mui/icons-material/MoreTime';

const SelectShiftByDate = () => {
    return (
        <>
            <Stack spacing={2}>
                <Shift />
                <Shift />
                <Shift />
            </Stack>
            <ButtonPrimary startIcon={<MoreTimeIcon />}>
                Add Shift
            </ButtonPrimary>
        </>
    )
}

export default SelectShiftByDate