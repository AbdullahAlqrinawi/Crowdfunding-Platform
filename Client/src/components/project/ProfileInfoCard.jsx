import PropTypes from "prop-types";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

export function ProfileInfoCard({ title, description, details, action }) {
  return (
    <Card color="transparent" shadow={false} className="bg-gray-800 text-white p-6 mb-10">
      <CardHeader
        color="transparent"
        shadow={false}
        floated={false}
        className="mb-4 flex items-center justify-between p-0"
      >
        <Typography variant="h5" className="text-white">
          {title}
        </Typography>
        {action}
      </CardHeader>

      <CardBody className="p-0">
        {description && (
          <Typography variant="small" className="text-gray-400 mb-4">
            {description}
          </Typography>
        )}

        {description && details && <hr className="my-4 border-gray-700" />}

        {details && (
          <ul className="grid gap-4">
            {Object.entries(details).map(([label, value], index) => (
              <li
                key={index}
                className="grid grid-cols-[150px_1fr] items-start gap-2"
              >
                <Typography variant="small" className="font-semibold text-white capitalize">
                  {label}:
                </Typography>
                <Typography variant="small" className="text-gray-300 font-normal">
                  {value}
                </Typography>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

ProfileInfoCard.defaultProps = {
  action: null,
  description: null,
  details: {},
};

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  details: PropTypes.object,
  action: PropTypes.node,
};
