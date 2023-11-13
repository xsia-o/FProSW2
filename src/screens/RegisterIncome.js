import React from 'react';

function RegisterIncome() {

    const passwordProps = {
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
        ),
    };
    const rowStackProps = {
        direction: "row",
        justifyContent: "center",
        alignItems: "center",
        spacing: 2,
    };
    const columnStackProps = {
        direction: "column",
        justifyContent: "center",
        alignItems: "center",
        spacing: 2,
    };
    return (
        <div className='whiteBoxRP' style={{ maxHeight: "400px", overflowY: "auto" }}>
            <IconButton color="primary" aria-label="back to login" onClick={() => onBack()}>
                <ArrowBackIcon />
            </IconButton>
        </div>
    );
}

export default RegisterIncome;
