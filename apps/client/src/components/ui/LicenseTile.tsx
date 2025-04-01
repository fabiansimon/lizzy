import {
  cn,
  formatDate,
  formatDuration,
  truncateAddress,
  truncateURL,
} from '../../lib/utils';
import { License } from '../../../../server/src/router/licence/licenseTypes';
import { Badge } from './badge';
import {
  AlertCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  FileText,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Separator } from './separator';
import { Button } from './button';

interface LicenseTileProps {
  license: License;
  trailing?: React.ReactNode;
}

export default function LicenseTile({ license, trailing }: LicenseTileProps) {
  return (
    <div
      key={license.id}
      className={cn(
        'bg-slate-900 border border-slate-800 rounded-lg p-4 relative',
        license.revoked && 'opacity-60'
      )}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="absolute -top-2">
            {license.revoked ? (
              <Badge
                variant="destructive"
                className="bg-red-900 hover:bg-red-800 px-3 py-1 text-sm font-medium"
              >
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                Revoked
              </Badge>
            ) : (
              <Badge className="bg-green-800 hover:bg-green-700 px-3 py-1 text-sm font-medium">
                <Clock className="h-3.5 w-3.5 mr-1" />
                Active
              </Badge>
            )}
          </div>
          <div className="flex items-start justify-between mt-4">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {license.title}
              </h3>
              <div className="flex items-center text-slate-400 mt-1">
                <User className="h-3 w-3 mr-1" />
                <span>{truncateAddress(license.vendor)}</span>
              </div>
            </div>
          </div>

          <Separator className="my-4 bg-slate-800" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center text-sm text-slate-300">
              <DollarSign className="h-4 w-4 mr-2 text-blue-400" />
              <span className="font-semibold">{license.price} ETH</span>
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <Clock className="h-4 w-4 mr-2 text-blue-400" />
              <span>Valid for {formatDuration(license.duration)}</span>
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <Calendar className="h-4 w-4 mr-2 text-blue-400" />
              <span>Purchased {formatDate(license.issuedAt)}</span>
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
        </div>

        <div className="flex justify-end">{trailing}</div>
      </div>
    </div>
  );
}
