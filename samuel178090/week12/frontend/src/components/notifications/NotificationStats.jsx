import { TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';

const NotificationStats = ({ stats }) => {
  const totalNotifications = Object.values(stats.byStatus || {}).reduce((sum, count) => sum + count, 0);
  const successfulNotifications = (stats.byStatus?.sent || 0) + (stats.byStatus?.delivered || 0);
  const successRate = totalNotifications > 0 ? ((successfulNotifications / totalNotifications) * 100).toFixed(1) : 0;
  const failedNotifications = stats.byStatus?.failed || 0;

  const statCards = [
    {
      title: 'Total Sent',
      value: successfulNotifications.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+2.1%',
      trendUp: true
    },
    {
      title: 'Failed',
      value: failedNotifications.toLocaleString(),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '-5%',
      trendUp: false
    },
    {
      title: 'Avg Delivery Time',
      value: '2.3s',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '-0.2s',
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last week</span>
                </div>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationStats;