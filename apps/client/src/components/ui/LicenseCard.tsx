import { Button } from './button';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import { License } from '../../../../server/src/router/licence/licenseTypes';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Badge } from './badge';
import { FileText, Calendar, Clock, DollarSign, User } from 'lucide-react';
import {
  truncateAddress,
  formatDate,
  formatDuration,
  truncateURL,
} from '../../lib/utils';

interface LicenseCardProps {
  license: License;
  children?: React.ReactNode;
}

export default function LicenseCard({ license, children }: LicenseCardProps) {
  return (
    <Card
      key={license.id}
      className={`bg-slate-900 border-slate-800 text-white ${
        license.revoked ? 'opacity-60' : ''
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{license.title}</CardTitle>
          {license.revoked && (
            <Badge
              variant="destructive"
              className="bg-red-900 hover:bg-red-800"
            >
              Revoked
            </Badge>
          )}
        </div>
        <CardDescription className="text-slate-400 flex items-center">
          <User className="h-3 w-3 mr-1" />
          {truncateAddress(license.vendor)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-slate-300">
            <DollarSign className="h-4 w-4 mr-2 text-blue-400" />
            <span className="font-semibold">{license.price} ETH</span>
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <Clock className="h-4 w-4 mr-2 text-blue-400" />
            {license.duration !== 0 ? (
              <span>{'Valid for ' + formatDuration(license.duration)}</span>
            ) : (
              <span>{'Valid indefinitely'}</span>
            )}
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <Calendar className="h-4 w-4 mr-2 text-blue-400" />
            <span>{'Created ' + formatDate(license.issuedAt)}</span>
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <FileText className="h-4 w-4 mr-2 text-blue-400" />
            {license.metaURI ? (
              <a
                href={license.metaURI}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-blue-400 flex items-center"
              >
                {truncateURL(license.metaURI)}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            ) : (
              <span className="text-slate-400">No added metadata</span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>{children}</CardFooter>
    </Card>
  );
}
