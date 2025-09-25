import { useState } from "react";
import {
  Box, TextField, Button, Stack,  CircularProgress,
  Backdrop
} from "@mui/material";
import { styled } from '@mui/material/styles';

import { useAuthHeaders } from "../../../hooks/useAuthHeader";
import { useSnackbar } from "../../../context/SnackbarContext";


const NameTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontSize: "1.5rem",
    fontWeight: 500,
    lineHeight: 1.6,
    color: "var(--black)",
    paddingTop: "8.5px",
    paddingBottom: "8.5px",
  },
});

type createTag = {
  name: string,
  source_address: string,
  description?: string,
};

const initTag:createTag = {
  name: "",
  source_address: "",
  description: ""
}


type Props = {
  setAllTags: Function;
};


export default function TagEdit({ setAllTags }: Props) {
  const headers = useAuthHeaders();
  const { showMessage } = useSnackbar()
  const [loading, setLoading] = useState(false);
  const [createdTag, setCreatedTag] = useState<createTag>(initTag);




  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    if (!createdTag) return;

    setLoading(true)
    
    let payload:createTag = {
      name:createdTag.name,
      source_address: createdTag.name
    };

    if (createdTag.description) {
      payload["description"] = createdTag.description;
    }
    
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ tag: createdTag }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      showMessage('Balise créé', 'success');
      setAllTags((prev: any) => ([
        ...prev, data
      ]));

    } catch (err) {
      showMessage('Erreur lors de la mise a jour', 'error');
      console.error("Erreur dans handleUpdate:", err);
    } finally{
      setLoading(false)
    }
  };


  return (
    <Box
      padding={3}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      width="100%"
    >
      <form onSubmit={(event)=>handleSubmit(event)} onReset={() => setCreatedTag(initTag)}>
        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
          <Stack spacing={3}>
            <Stack direction="row" spacing={1} mt={1} justifyContent="space-between" alignItems="center" width={'100%'}>
              <NameTextField
                label="Nom"
                value={createdTag?.name?? ''}
                onChange={(e) => {
                  setCreatedTag(prev => ({...prev, name :e.target.value }));
                }}
                size="small"
              />

              <TextField
                label="Source adresse"
                value={createdTag?.source_address?? ''}
                placeholder="105626262"
                onChange={(e) => {
                  setCreatedTag(prev => ({...prev, source_address :e.target.value }));
                }}
                size="small"
              />

            </Stack>

            <TextField
              label="Description"
              placeholder="Ma description ..."
              value={createdTag?.description ?? ''}
              onChange={(e) => {
                setCreatedTag(prev => ({...prev, description : e.target.value }));
              }}
              fullWidth
              multiline
              rows={2}
              size="small"
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                type="reset"
                sx={{
                  color: 'var(--dark-red)',
                  backgroundColor: 'var(--light-red)',
                  p: '6px 12px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.10)',
                  fontWeight: 500,
                }}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  color: 'var(--dark-green)',
                  backgroundColor: 'var(--light-green)',
                  p: '6px 12px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.10)',
                  fontWeight: 500,
                }}
              >
                Créer
              </Button>
            </Stack>
          </Stack>
        </form>
    </Box>
  );
}
