import { DialogTrigger, Dialog, Modal, Row, Icon, Pressable, Text } from '@umami/react-zen';
import { Search } from '@/components/icons';
import { SearchDialog } from '@/components/docs/SearchDialog';

export function SearchButton() {
  return (
    <DialogTrigger>
      <Pressable>
        <Row
          alignItems="center"
          justifyContent="flex-start"
          width="100%"
          gap
          padding
          border
          borderRadius
          backgroundColor="2"
          style={{ cursor: 'pointer' }}
        >
          <Icon color="muted">
            <Search />
          </Icon>
          <Text color="muted">Search</Text>
        </Row>
      </Pressable>
      <Modal>
        <Dialog>
          <SearchDialog />
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
