import { Card, CardHeader, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import PropTypes from "prop-types";

export function ProfileEditCard({ details, onSave }) {
  return (
    <Card color="transparent" shadow={false} className="bg-gray-800 text-white">
      <CardHeader
        color="transparent"
        shadow={false}
        floated={false}
        className="mx-0 mt-0 mb-4"
      >
        <Typography variant="h6" className="text-white">
          Edit Profile
        </Typography>
      </CardHeader>
      <CardBody className="p-0 flex flex-col gap-4">
        {Object.keys(details).map((key, index) => (
          <div key={index}>
            <Typography variant="small" className="mb-1 font-semibold text-white">
              {key}
            </Typography>
            <Input defaultValue={details[key]} className="text-white bg-gray-900 border-gray-700" />
          </div>
        ))}
        <div className="mt-6 flex justify-end">
          <Button color="blue" onClick={onSave}>
            Save Changes
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

ProfileEditCard.propTypes = {
  details: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};
