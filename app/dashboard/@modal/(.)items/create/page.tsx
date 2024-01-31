import Modal from "@/app/ui/modal";
import ItemCreateForm from "@/app/ui/items/create-form";

export default async function Page() {
    return (
        <Modal>
            <ItemCreateForm />
        </Modal>
    );
}
